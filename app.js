const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const compression = require('compression');
const helmet = require('helmet');

const app = express();

const scrapeMessages = require('./utils/scrapeMessages');
const scrapeContent = require('./utils/scrapeContent');

app.use(compression());
app.use(helmet());

app.use(bodyParser.json());
app.use(express.static(__dirname + '/assets'));

// sending static html pages
app.get('/', (req, res) => res.sendFile(__dirname + '/pages/index.html'));
app.get('/messages', (req, res) => res.sendFile(__dirname + '/pages/messages.html'));

app.post('/api/validateUser', (req, res) => {
    (async () => {
        try {
            // send post request to api
            let response = await fetch('https://iemb.hci.edu.sg/home/ValidateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: req.body.username,
                    password: req.body.password
                })
            });
            let data = await response.json();
            if (data.Success) res.json({ 'success': true, 'sessid': response.headers.get('set-cookie').match(/ASP\.NET_SessionId=\w+?;/)[0].slice(18, -1) });
            else res.json({ 'success': false, 'reason': 'invalid' });
        } catch (err) {
            // if error occurred
            res.json({ 'success': false, 'reason': 'unknown' });
        }
    })();
});

app.post('/api/getMessages', (req, res) => {
    try {
        (async () => {
            // send get request to message board
            const response = await fetch('https://iemb.hci.edu.sg/Board/Detail/1048', {
                method: 'GET',
                headers: {
                    Cookie: `ASP.NET_SessionId=${req.body.sessid};`
                }
            }), html = await response.text();
            if (/<input type="password"/.test(html)) res.json({ 'success': false, 'reason': 'sessid' });
            else res.json({ 'success': true, 'messages': scrapeMessages(html) });
        })();
    } catch (err) {
        res.json({ 'success': false, 'reason': 'unknown' });
    }
});

app.post('/api/getMessageContent', (req, res) => {
    (async () => {
        const response = await fetch(`https://iemb.hci.edu.sg/Board/content/${req.body.id}?board=${req.body.board}&isArchived=False`, {
            method: 'GET',
            headers: {
                Cookie: `ASP.NET_SessionId=${req.body.sessid};`
            }
        }), html = await response.text();
        res.json({ 'content': scrapeContent(html) });
    })();
});

// app initialize
app.listen(3000, () => console.log("app listening on port 3000"));