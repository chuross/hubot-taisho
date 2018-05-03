const LineMessaging = require('hubot-line-messaging');

const imageUrl = 'https://hailstorm.c.yimg.jp/iwiz-weather/raincloud/1525318200/202020-anim-pf1300.gif';

module.exports = robot => {
  robot.hear(/^大将今日の天気$/, res => {
    res.replay(new LineMessaging.SendImage(imageUrl, imageUrl));
  });
};