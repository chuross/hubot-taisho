const LineMessaging = require('hubot-line-messaging');
const Utils = require('./libs/Utils');

const sushiImageUrls = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb2E3lfTyr1WzbewSvt37rwe9yXjSDpQzdSxb3_iIl5aIGbSV19w'
];

module.exports = robot => {
  robot.hear(/^大将(!|！)$/, res => {
    res.reply([
      '大将！いつもの - いつものあれ用意してますぜ',
      '大将！アメッシュ - 関東地方の雨雲画像を表示しやすぜ',
      "大将！予定 <日付> <タスク名> - 指定された日付でタスクをTodoistに追加しやすぜ\n(※要権限)\n  <日付> - 今日・明日・来週・来月またはmm-dd・yyyy-mm-dd",
      "大将！献立 <キーワード>\n  <キーワード> - 材料や料理名など",
    ].join("\n\n"));
  });

  robot.hear(/^大将(!|！)いつもの$/, res => {
    const index = Math.floor(Math.random() * (sushiImageUrls.length - 0));
    const sushiImageUrl = sushiImageUrls[index];
    
    if (Utils.isLine) {
      res.reply('へいお待ち！', new LineMessaging.SendImage(sushiImageUrl, sushiImageUrl));
    } else {
      res.reply(`ヘイお待ち！\n${sushiImageUrl}`);
    }
  });
};