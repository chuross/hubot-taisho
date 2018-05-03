const LineMessaging = require('hubot-line-messaging');
const cheerio = require('cheerio')
const axios = require('axios');

const weatherUrl = 'https://weather.yahoo.co.jp/weather/raincloud/';

module.exports = robot => {
  robot.hear(/^大将(!|！)アメッシュ$/, res => {
    axios.get(`${weatherUrl}`, {
      responseType: 'text'
    })
    .then(data => cheerio.load(data))
    .then($ => $('#imgDatCh .mainImg img').attr("src"))
    .then(imageUrl => res.reply(new LineMessaging.SendImage(imageUrl, imageUrl)))
    .catch(error => console.log(error))
  });
};