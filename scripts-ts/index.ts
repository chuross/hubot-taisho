import hubot = require('hubot');

module.exports = (robot: hubot.Robot<any>): void => {

  robot.hear(/^大将！$/, res => {
    res.reply([
      'ヘイ！お待ち！',
      'http://www.tamasushi.co.jp/wordpress/wp-content/themes/xeory_base_child/lib/common/img/tabehoImg_02.jpg'
    ].join("\n"));
  });
};