const LineMessaging = require('hubot-line-messaging');

module.exports = (robot) => {
  robot.hear(/^大将いつもの$/, res => {
    res.reply('ヘイ！お待ち！');

    const sushiBaseUrl = 'https://www.instagram.com/p/BiQUYnElTyu/media';
    setTimeout(() => {
      res.reply(new LineMessaging.SendImage(`${sushiBaseUrl}?size=l`, `${sushiBaseUrl}?size=l`));
    }, 100);
  });
};