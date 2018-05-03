const LineMessaging = require('hubot-line-messaging');
const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://oceans-nadia.com/search';

module.exports = robot => {
  robot.hear(/^大将(!|！)献立 (.+)$/, res => {
    console.log('あいよ！');

    const query = res.match[2];
    if (query == '') {
      res.reply('献立にはキーワードが必要だよ！');
      return;
    }

    axios.get(`${baseUrl}?q=${encodeURIComponent(query)}`, {
      responseType: 'text'
    })
    .then(response => cheerio.load(response.data))
    .then($ => $('.rightList ul').eq(1).children().map((index, node) => {
      $node = $(node);
      return {
        thumbnailUrl: $node.find('.photo-frame img').attr('src'),
        linkUrl: $node.find('.photo-frame a').attr('href'),
        title: $node.find('.txt-frame .recipe-titlelink').text(),
        recipeTime: $node.find('.txt-frame .recipeTime').text()
      };
    }).get())
    .then(result => {
      const messageBuilder = new LineMessaging.BuildTemplateMessage()
        .init('へいお待ち！献立用意しといたよ！');
      
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
      
      res.reply(messageBuilder.build());
    })
    .catch(error => console.log(error))
  });
};
