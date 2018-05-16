// Commands:
//   大将！アメッシュ - 関東地方の雨雲画像を表示しやすぜ

const LineMessaging = require('hubot-line-messaging');
const cheerio = require('cheerio');
const axios = require('axios');
const Utils = require('./libs/Utils');

const weatherUrl = 'https://weather.yahoo.co.jp/weather/jp/raincloud/3.html';

module.exports = robot => {
  robot.hear(/^大将(!|！)アメッシュ$/, async res => {
    try {
      const response = await axios.get(`${weatherUrl}`, { responseType: 'text' })
      const $ = cheerio.load(response.data);
      const imageUrl = $('#imgDatCh .mainImg img').attr("src");

      if (Utils.isLine) {
        res.reply(new LineMessaging.SendImage(imageUrl, imageUrl));
      } else {
        res.reply(imageUrl);
      }
    } catch (error) {
      console.log(error);
    }
  });
};