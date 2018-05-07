// Commands:
//   大将！献立 <材料や料理名など> - キーワードに合う料理を紹介しやすぜ

const LineMessaging = require('hubot-line-messaging');
const axios = require('axios');
const cheerio = require('cheerio');
const Utils = require('./libs/Utils');

module.exports = robot => {
  robot.hear(/^大将(!|！)献立 (.+)$/, res => {
    const query = res.match[2];
    if (query == '') {
      res.reply('献立にはキーワードが必要だよ！');
      return;
    }

    getRecipesByKurashiru(query)
      .then(result => result.length > 0 ? result : getRecipesByCookpad(query))
      .then(result => result.slice(0, 10))
      .then(result => {
        if (result.length === 0) {
          res.reply('すまないねぇこの献立は用意できないよ');
          return;
        }

        if (!Utils.isLine) {
          res.reply('ヘイお待ち！献立用意しといたよ！', result.map(item => `${item.title} ${item.linkUrl}`).join("\n"))
          return;
        }

        const messageBuilder = new LineMessaging.BuildTemplateMessage.init('献立だよ！');
        
        result.forEach(item => {
          messageBuilder.carousel({
            thumbnailImageUrl: item.thumbnailUrl,
            title: item.title,
            text: item.description
          });
          messageBuilder.action('uri', {
            label: 'ブラウザで見る',
            uri: item.linkUrl
          })
        });
        
        res.reply('ヘイお待ち！献立用意しといたよ！', messageBuilder.build());
      })
      .catch(error => console.log(error))
  });
};

function getRecipesByKurashiru(query) {
  const baseUrl = 'https://www.kurashiru.com';
  const searchUrl = `${baseUrl}/search`;

  return axios.get(`${searchUrl}?query=${encodeURIComponent(query.split(' ').join('+'))}`, {
    responseType: 'text'
  })
  .then(response => cheerio.load(response.data))
  .then($ => $('.videos-list .video-list-content')
    .filter((index, node) => $(node).find('.pr_logo').get().length === 0)
    .map((index, node) => {
      $node = $(node);
      const id = `${$node.find('.video-list-img').attr('href')}`.substring(9);
      return {
        title: $node.find('.video-list-info .video-list-title a').text(),
        description: `by クラシル\n${$node.find('.video-list-info .video-list-introduction').text()}`,
        thumbnailUrl: `https://video.kurashiru.com/production/videos/${id}/compressed_thumbnail_square_large.jpg`,
        linkUrl: baseUrl + $node.find('.video-list-img').attr('href'),
      };
    }).get()
  );
}

function getRecipesByCookpad(query) {
  const baseUrl = 'https://cookpad.com';
  const searchUrl = `${baseUrl}/search`;

  return axios.get(`${searchUrl}/${encodeURIComponent(query.split(' '))}`, {
    responseType: 'text'
  })
  .then(response => cheerio.load(response.data))
  .then($ => $('.recipe-preview').map((index, node) => {
    const $node = $(node);
    return {
      title: $node.find('.recipe-title').text(),
      description: `by cookpad\n${$node.find('.recipe_description').text().trim()}`,
      linkUrl: baseUrl + $node.find('.recipe-title').attr('href'),
      thumbnailUrl: $node.find('.recipe-image img').attr('src')
    };
  }).get());
}
