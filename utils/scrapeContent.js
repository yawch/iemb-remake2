const cheerio = require('cheerio');

module.exports = (html) => {
    const $ = cheerio.load(html);
    let attachments = [];
    if (/addConfirmedChild\('attaches','[\S\s]+?\);/.test(html)) {
        html.match(/addConfirmedChild\('attaches','[\S\s]+?\);/g).forEach((match) => {
            attachments.push(match.match(/'attaches','[\S\s]+?','/)[0].slice(12, -3));
        });
    }
    return { 
        'content': $('#hyplink-css-style').html().replace(/style=".+?"/g, '').replace(/width=".+?"/g, ''),
        attachments
    }
}