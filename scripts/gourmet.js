// Commands:
//   大将！グルメ <場所> <キーワード> - 周辺のおいしいもの探しやすぜ

const LineMessaging = require('hubot-line-messaging');
const axios = require('axios');
const cheerio = require('cheerio');
const Utils = require('./libs/Utils');

const baseUrl = 'https://tabelog.com';
const searchUrl = `${baseUrl}/rst/rstsearch?voluntary_search=1&LstKind=1`;

module.exports = robot => {
  robot.hear(/大将(!|！)(ぐるめ|グルメ) (.+) (.+)/, async res => {
    const place = res.match[3];
    const keyword = res.match[4];

    if (place.length === 0) {
      res.reply('探す場所を教えてくんな！');
      return;
    }
    if (keyword.length === 0) {
      res.reply('どんな店を探したいのか教えてくんな！');
      return;
    }

    try {
      const rankUrl = await getRankUrl(place, keyword);
      const groumets = await getGourmets(rankUrl);

      const result = groumets.slice(0, 10);

      if (result.length === 0) {
        res.reply('すまないねぇ該当のお店が無かったよ');
        return;
      }

      if (!Utils.isLine) {
        res.reply('ヘイお待ち！いい店探しといたよ！', result.map(item => `${item.title} / ${item.area}\n${getRatingText(item.rating)} ${item.rating}\n夜:${item.nightPrice} 昼:${item.dayPrice}\n${item.linkUrl}`).join("\n\n"))
        return;
      }

      const messageBuilder = new LineMessaging.BuildTemplateMessage.init('いい店だよ！');
      
      result.forEach(item => {
        messageBuilder.carousel({
          thumbnailImageUrl: item.thumbnailUrl,
          title: item.title,
          text: `${item.area}\n${getRatingText(item.rating)} ${item.rating}\n夜:${item.nightPrice} 昼:${item.dayPrice}`
        });
        messageBuilder.action('uri', {
          label: 'ブラウザで見る',
          uri: item.linkUrl
        })
      });
      
      res.reply('ヘイお待ち！いい店探しといたよ！', messageBuilder.build());
    } catch (error) {
      console.log(error);
    }
  });
};

async function getRankUrl(place, keyword) {
  const response = await axios.get(`${searchUrl}&sa=${encodeURIComponent(place)}&sk=${encodeURIComponent(keyword)}`, {
    responseType: 'text'
  });
  const $ = cheerio.load(response.data);
  return $('.navi-rstlst__link--rank').attr('href');
}

async function getGourmets(rankUrl) {
  const response = await axios.get(rankUrl, { responseType: 'text' });
  const $ = cheerio.load(response.data);

  return $('.rstlist-info > .list-rst').map((index, node) => {
      const $node = $(node);
      return {
        title: $node.find('.list-rst__rst-name a').text(),
        area: $node.find('.list-rst__area-genre').text().split('/')[0].trim(),
        rating: $node.find('.list-rst__rating-val').text(),
        nightPrice: $node.find('.list-rst__budget li').first().find('.list-rst__budget-val').text(),
        dayPrice: $node.find('.list-rst__budget li').last().find('.list-rst__budget-val').text(),
        linkUrl: $node.find('.list-rst__rst-name a').attr('href'),
        thumbnailUrl: $node.find('.cpy-main-image').attr('data-original').replace('150x150', '320x320')
      };
    }).get();
}

function getRatingText(rating) {
  const point = rating[0];
  switch (point) {
    case '1': return '★☆☆☆☆'
    case '2': return '★★☆☆☆'
    case '3': return '★★★☆☆'
    case '4': return '★★★★☆'
    case '5': return '★★★★★'
    default: return '-'
  }
}