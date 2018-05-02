import hubot = require('hubot');

module.exports = (robot: hubot.Robot<any>): void => {

  robot.hear(/^いけっピカチュウ！$/, res => {
    res.send([
      'ピーカーチュウウウゥゥゥゥゥ！',
      'http://piranha.c.blog.so-net.ne.jp/_images/blog/_952/piranha/m_images-72852.jpeg'
    ].join("\n"));
  });
};