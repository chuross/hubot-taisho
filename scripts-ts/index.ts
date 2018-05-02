import hubot = require('hubot');
import LineMessaging = require('hubot-line-messaging');

module.exports = (robot: hubot.Robot<any>): void => {

  robot.hear(/^大将(！|!)$/, res => {
    res.reply('ヘイ！お待ち！');
    res.reply(new LineMessaging.SendImage('https://www.instagram.com/p/BiQUYnElTyu/media?size=m', 'https://www.instagram.com/p/BiQUYnElTyu/media?size=l'))
  });
};