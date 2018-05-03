const LineMessaging = require('hubot-line-messaging');
const axios = require('axios');
const cheerio = require('cheerio');
const Utils = require('./libs/Utils');

const baseUrl = 'https://oceans-nadia.com';
const searchUrl = `${baseUrl}/search`;

module.exports = robot => {
  robot.hear(/^大将(!|！)献立 (.+)$/, res => {
    const query = res.match[2];
    if (query == '') {
      res.reply('献立にはキーワードが必要だよ！');
      return;
    }

    axios.get(`${searchUrl}?q=${encodeURIComponent(query)}`, {
      responseType: 'text'
    })
    .then(response => cheerio.load(response.data))
    .then($ => $('.rightList ul').eq(1).children().map((index, node) => {
      $node = $(node);
      return {
        thumbnailUrl: $node.find('.photo-frame img').attr('src'),
        linkUrl: baseUrl + $node.find('.txt-frame .recipe-title a').attr('href'),
        title: $node.find('.txt-frame .recipe-titlelink').text(),
        recipeTime: $node.find('.txt-frame .recipeTime').text()
      };
    }).get())
    .then(result => result.slice(0, 10))
    .then(result => {
      if (!Utils.isLine) {
        res.reply('ヘイお待ち！献立用意しといたよ！', result.map(item => `${item.title} / ${item.recipeTime} ${item.linkUrl}`).join("\n"))
        return;
      }

      const messageBuilder = new LineMessaging.BuildTemplateMessage.init('献立だよ！');
      
      result.forEach(item => {
        messageBuilder.carousel({
          thumbnailImageUrl: item.thumbnailUrl,
          title: item.title,
          text: item.recipeTime
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
