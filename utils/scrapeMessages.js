const cheerio = require('cheerio');
const convertDateString = (dateString) => {
    return `${dateString.substr(0, 2)} ${dateString.substr(3, 3)} 20${dateString.substr(7, 2)}`;
}

module.exports = (html) => {
    let messages = [], rmessages = [];
    const $ = cheerio.load(html);
    if ($('#tab_table tbody tr').text().trim() !== 'No Record Found!') {
        $('#tab_table tbody tr').each(function () {
            messages.push({
                title: $(this).find('a.messageboard').text().trim(),
                abbrsender: $(this).find('a.tooltip').text().trim(),
                sender: $(this).find('a.tooltip').attr('tooltip-data').trim(),
                date: convertDateString($(this).find('td').first().text().trim().replace(/-/g, '/')),
                unread: true,
                board: 1048,
                id: $(this).find('a.messageboard').attr('href').substr(15, 5)
            });
        });
    }
    if ($('#tab_table1 tbody tr').text().trim() !== 'No Record Found!') {
        $('#tab_table1 tbody tr').each(function () {
            rmessages.push({
                title: $(this).find('a.messageboardwithoutbold').text().trim(),
                abbrsender: $(this).find('a.tooltip').first().text().trim(),
                sender: $(this).find('a.tooltip').first().attr('tooltip-data').trim(),
                date: convertDateString($(this).find('td').first().text().trim().replace(/-/g, '/')),
                unread: false,
                board: 1048,
                id: $(this).find('a.messageboardwithoutbold').attr('href').substr(15, 5)
            });
        });
    }
    messages.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1);
    rmessages.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1);
    return messages.concat(rmessages);
}