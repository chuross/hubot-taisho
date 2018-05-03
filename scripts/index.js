const LineMessaging = require('hubot-line-messaging');
const Utils = require('./libs/Utils');

const sushiImageUrls = [
  'https://www.instagram.com/p/BiOihl7lj6Z',
  'https://www.instagram.com/p/BiQUYnElTyu',
  'https://www.instagram.com/p/BiTHKhIFx3U',
  'https://www.instagram.com/p/BiTEdbiloQ4',
  'https://www.instagram.com/p/BiTCuIigAZ0',
  'https://www.instagram.com/p/BiS_oRPn5_j',
  'https://www.instagram.com/p/BiNQnaCFTHU',
  'https://www.instagram.com/p/BiSzAkOHLOQ',
  'https://www.instagram.com/p/BiSTvGgFjJR',
  'https://www.instagram.com/p/BiSS5vBF93p',
  'https://www.instagram.com/p/BiSKH1WFxmc'
];

module.exports = robot => {
  robot.hear(/^大将(!|！)いつもの$/, res => {
    const index = Math.floor(Math.random() * (sushiImageUrls.length - 0));
    const sushiBaseUrl = sushiImageUrls[index];
    
    if (Utils.isLine) {
      res.reply([
        'へいお待ち！',
        new LineMessaging.SendImage(`${sushiBaseUrl}/media?size=l`, `${sushiBaseUrl}/media?size=s`)
      ]);
    } else {
      res.reply(`ヘイお待ち！\n${sushiBaseUrl}/media?size=l`);
    }
  });
};