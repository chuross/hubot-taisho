// Commands:
//   大将！上映中の映画 - 上映中の映画一覧をおすすめ順に表示しやすぜ

const LineMessaging = require('hubot-line-messaging');
const axios = require('axios');
const cheerio = require('cheerio');
const Utils = require('./libs/Utils');

const baseUrl = 'https://filmarks.com';
const rankUrl = `${baseUrl}/list/now`;

module.exports = robot => {
  robot.hear(/^大将(!|！)上映中の映画$/, async res => {
    try {
      const response = await axios.get(rankUrl, { responseType: 'text' });
      const $ = cheerio.load(response.data);
      const result = $('.p-movies-grid .p-movie-cassette').map((index, node) => {
          const $node = $(node);
          return {
            title: $node.find('.p-movie-cassette__info .p-movie-cassette__title').text(),
            thumbnailUrl: $node.find('.p-movie-cassette__info .p-movie-cassette__jacket img').attr('src'),
            linkUrl: `${baseUrl}${$node.find('.p-movie-cassette__info .p-movie-cassette__readmore').attr('href')}`,
            startAt: $node.find('.p-movie-cassette__other-info span').eq(0).text(),
            movieTime: $node.find('.p-movie-cassette__other-info span').eq(1).text()
          };
        }).get().slice(0, 10);
      
      if (!Utils.isLine) {
        res.reply('ヘイお待ち！上映中の映画だよ！', result.map(item => `${item.title}\n${item.linkUrl}`).join("\n\n"));
        return;
      }

      const messageBuilder = new LineMessaging.BuildTemplateMessage.init('上映中の映画だよ！');
      
      result.forEach(item => {
        messageBuilder.carousel({
          thumbnailImageUrl: item.thumbnailUrl,
          title: item.title,
          text: `上映日: ${item.startAt} / 上映時間: ${item.movieTime}`
        });
        messageBuilder.action('uri', {
          label: 'ブラウザで見る',
          uri: item.linkUrl
        })
      });
      
      res.reply('ヘイお待ち！上映中の映画だよ！', messageBuilder.build());
    } catch (error) {
      console.log(error);
    }
  });
};