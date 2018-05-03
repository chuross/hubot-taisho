const LineMessaging = require('hubot-line-messaging');

module.exports = (robot) => {
  robot.hear(/^大将(！|!)$/, res => {
    res.reply('ヘイ！お待ち！');
    res.reply('今日もいいの入ったよ')

    const sushiBaseUrl = 'https://www.instagram.com/p/BiQUYnElTyu/media';
    res.reply(new LineMessaging.SendImage(`${sushiBaseUrl}?size=l`, `${sushiBaseUrl}?size=l`));
  });
};