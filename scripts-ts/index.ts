import hubot = require('hubot');
import LineMessaging = require('hubot-line-messaging');

module.exports = (robot: hubot.Robot<any>): void => {

  robot.hear(/^大将(！|!)$/, res => {
    res.reply('ヘイ！お待ち！');

    const sushiBaseUrl = 'https://www.instagram.com/p/BiQUYnElTyu/media';
    res.reply(new LineMessaging.SendImage(`${sushiBaseUrl}?size=l`, `${sushiBaseUrl}?size=l`));
  });
};