import hubot = require('hubot');

module.exports = (robot: hubot.Robot<any>): void => {

  robot.hear(/^大将(！|!)$/, res => {
    res.reply('ヘイ！お待ち！');
  });
};