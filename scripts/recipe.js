const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://oceans-nadia.com/search';

module.exports = robot => {
  robot.hear(/^大将(!|！)$/, res => {
    res.reply('あいよ！');

    // const query = res.match[2];
    // if (query == '') {
    //   res.reply('献立にはキーワードが必要だよ！');
    //   return;
    // }

    // axios.get(`${baseUrl}?q=${encodeURIComponent(query)}`, {
    //   responseType: 'text'
    // })
    // .then(response => cheerio.load(response.data))
    // .then($ => console.log($('.rightList ul').children()))
    // .catch(error => console.log(error))
  });
};