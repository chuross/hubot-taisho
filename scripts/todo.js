const axios = require('axios');

const apiBaseUrl = 'https://todoist.com/api/v7/';
const apiToken = process.env.HUBOT_TODOIST_TOKEN;

const adminUsers = (process.env.HUBOT_ADMIN || '').split(',');
const targetProjectId = process.env.HUBOT_TODOIST_PROJECT_ID;

const fetch = axios.create({
  baseURL: apiBaseUrl
});

module.exports = robot => {
  robot.hear(/^大将(！|!)予定 (.+)/, res => {
    if (!adminUsers.includes(res.message.user.id)) {
      res.reply("お客さんそいつは聞けないねぇ\n権限振ってもらいな");
      return;
    }

    if (!targetProjectId) {
      res.reply('追加先のプロジェクトが無いねえ');
      return;
    }

    const title = res.match.length == 3 ? res.match[2] : null;
    if (!title) {
      res.reply('用件はなんだい？');
      return;
    }

    const commandString = JSON.stringify([
      {
        type: 'item_add',
        args: {
          content: title,
          project_id: targetProjectId
        }
      }
    ]);

    fetch.post('/sync', {
      token: apiToken,
      commands: commandString
    }).then(result => {
      res.reply(`予定を登録しといたよ！\n${title}`);
    });
  });
};