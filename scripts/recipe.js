const LineMessaging = require('hubot-line-messaging');
const axios = require('axios');
const cheerio = require('cheerio');
const Utils = require('./libs/Utils');

const baseUrl = 'https://www.kurashiru.com';
const searchUrl = `${baseUrl}/search`;

module.exports = robot => {
  robot.hear(/^大将(!|！)献立 (.+)$/, res => {
    const query = res.match[2];
    if (query == '') {
      res.reply('献立にはキーワードが必要だよ！');
      return;
    }

    axios.get(`${searchUrl}?query=${encodeURIComponent(query.split(' ').join('+'))}`, {
      responseType: 'text'
    })
    .then(response => cheerio.load(response.data))
    .then($ => $('.videos-list .video-list-content')
      .filter((index, node) => $(node).find('.pr_logo').get().length === 0)
      .map((index, node) => {
        $node = $(node);
        return {
          thumbnailUrl: $node.find('.video-list-img img').attr('src'),
          linkUrl: baseUrl + $node.find('.video-list-img').attr('href'),
          title: $node.find('.video-list-info .video-list-title a').text(),
          recipeTime: $node.find('.video-list-info .video-list-introduction').text()
        };
      }).get()
    )
    .then(result => result.slice(0, 10))
    .then(result => {
      if (result.length === 0) {
        res.reply('すまないねぇこの献立は用意できないよ');
        return;
      }

      if (!Utils.isLine) {
        res.reply('ヘイお待ち！献立用意しといたよ！', result.map(item => `${item.title} / ${item.recipeTime} ${item.linkUrl}`).join("\n"))
        return;
      }

      const messageBuilder = new LineMessaging.BuildTemplateMessage.init('献立だよ！');
      
      result.forEach(item => {
        messageBuilder.carousel({
          thumbnailImageUrl: item.thumbnailUrl,
          title: item.title,
          text: `調理時間: ${item.recipeTime}`
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
