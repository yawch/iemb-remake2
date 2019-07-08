const cheerio = require('cheerio');

module.exports = (html) => {
    const $ = cheerio.load(html);
    return $('#hyplink-css-style').html().replace(/style=".+?"/g, '').replace(/width=".+?"/g, '');
}