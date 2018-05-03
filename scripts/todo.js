
module.exports = robot => {
  robot.hear(/^大将(！|!)予定 (.+)/, res => {
    const adminUsers = (process.env.HUBOT_ADMIN || '').split(',');
    if (!adminUsers.includes(res.user.id)) {
      res.reply("お客さんそいつは聞けないねぇ\n権限振ってもらいな");
      return;
    }
    

  });
};