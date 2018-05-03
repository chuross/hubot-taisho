const LineMessaging = require('hubot-line-messaging');
const axios = require('axios');
const cheerio = require('cheerio');
const Utils = require('./libs/Utils');

const baseUrl = 'http://eiga.com';
const rankUrl = `${baseUrl}/now/all/rank/`;

module.exports = robot => {
  robot.hear(/^大将(!|！)上映中の映画$/, res => {
    axios.get(rankUrl, {
      responseType: 'text'
    })
    .then(response => cheerio.load(response.data))
    .then($ => $('#now_movies .m_unit').map((index, node) => {
      const $node = $(node);
      return {
        title: $node.find('h3 a').text(),
        thumbnailUrl: $node.children().last().find('img').attr('src'),
        linkUrl: `${baseUrl}${$node.find('h3 a').attr('href')}`
      };
    }).get())
    .then(result => result.slice(0, 10))
    .then(result => {
      if (Utils.isLine) {
        res.reply(result.map(item => `${item.title} ${item.linkUrl}`).join("\n\n"));
        return;
      }

      const messageBuilder = new LineMessaging.BuildTemplateMessage.init('上映中の映画だよ！');
      
      result.forEach(item => {
        messageBuilder.carousel({
          thumbnailImageUrl: item.thumbnailUrl,
          title: item.title,
          text: '-'
        });
        messageBuilder.action('uri', {
          label: 'ブラウザで見る',
          uri: item.linkUrl
        })
      });
      
      res.reply('ヘイお待ち！上映中の映画だよ！', messageBuilder.build());
    })
    .catch(error => console.log(error));
  });
};