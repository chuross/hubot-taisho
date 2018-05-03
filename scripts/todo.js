const axios = require('axios');
const uuidv4 = require('uuid/v4');

const apiBaseUrl = 'https://todoist.com/api/v7/';
const apiToken = process.env.HUBOT_TODOIST_TOKEN;

const adminUsers = (process.env.HUBOT_ADMIN || '').split(',');
const targetProjectId = process.env.HUBOT_TODOIST_PROJECT_ID;

module.exports = robot => {
  robot.hear(/^大将(！|!)予定 (.*) (.+)/, res => {
    if (!adminUsers.includes(res.message.user.id)) {
      console.log(res.message);
      res.reply("お客さんそいつは聞けないねぇ\n権限振ってもらいな");
      return;
    }

    if (!targetProjectId) {
      res.reply('追加先のプロジェクトが無いねえ');
      return;
    }

    const dateString = res.match[2];
    if (dateString == '') {
      res.reply([
        'いつの予定なんだい？',
        'フォーマットはこれに対応してるよ',
        '直近: 今日, 明日, 来週, 来月',
        '月日: mm月dd日, mm-dd',
        '年月日 yyyy年mm月dd日, yyyy-mm-dd'
      ].join("\n"));
      return;
    }

    const title = res.match[3];
    if (title == '') {
      res.reply('用件はなんだい？');
      return;
    }

    const commandString = JSON.stringify([
      {
        type: 'item_add',
        uuid: uuidv4(),
        temp_id: uuidv4(),
        args: {
          content: title,
          date_string: dateString,
          project_id: targetProjectId
        }
      }
    ]);

    axios.post(`${apiBaseUrl}/sync`, {
      token: apiToken,
      commands: commandString
    })
    .then(result => {
      res.reply(`予定を登録しといたよ！\nTodoistで確認してくんな！\n\nタスク: ${title}`);
    })
    .catch(error => console.log(error));
  });
};