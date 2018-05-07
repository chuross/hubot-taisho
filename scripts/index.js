// Commands:
//   大将！いつもの - いつものあれ用意してますぜ

const LineMessaging = require('hubot-line-messaging');
const Utils = require('./libs/Utils');

const sushiImageUrls = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyzX14FM3H-nja_M3w82EP28osjWfjtIQRa6QLLpWsECiGuxOlKg',
  'https://tblg.k-img.com/restaurant/images/Rvw/59650/640x640_rect_59650578.jpg',
  'https://d35omnrtvqomev.cloudfront.net/photo/article/article_part/image_path_1/25860/50f1bf46a8033d30770a31d94ce8e8.jpg',
  'http://best-travel.tokyo/wp-content/uploads/2018/02/%E3%81%86%E3%81%AB_R.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu0owNvCKBw7K7sCuMrGcaP_l9tEpbkCSDSQIRYEmeJ3yuxQhrxQ',
  'http://ninnpusan.com/img/uni.jpg',
  'https://blog-imgs-70.fc2.com/i/c/h/ichii445/uni12.jpg',
  'https://pu-3.com/manpuku/wp-content/uploads/20080815204849.jpg',
  'https://tblg.k-img.com/restaurant/images/Rvw/68409/640x640_rect_68409433.jpg',
  'https://favy-tokyo.s3.amazonaws.com/uploads/topic_item/image/364497/retina_IMG_1683.jpg'
];

module.exports = robot => {
  robot.hear(/^大将(!|！)$/, res => {
    res.reply(robot.helpCommands().join("\n\n"));
    // res.reply([
    //   '大将！いつもの - いつものあれ用意してますぜ',
    //   '大将！アメッシュ - 関東地方の雨雲画像を表示しやすぜ',
    //   "大将！予定 <日付> <タスク名> - 指定された日付でタスクをTodoistに追加しやすぜ\n(※要権限)\n  <日付> - 今日・明日・来週・来月またはmm-dd・yyyy-mm-dd",
    //   "大将！献立 <キーワード>\n  <キーワード> - 材料や料理名など",
    // ].join("\n\n"));
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