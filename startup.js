require('dotenv/config');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const https = require('https');
const http = require('http');
const app = express();
const telegram = require('./telegram');
const telegramBot = new telegram.TelegramBot();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

if (telegramBot.start()) {
  console.log('Bot starts working...');
}

//change to
http.createServer(app).listen(80); //80
https.createServer(app).listen(443); //443

app.post('/addOrder', urlencodedParser, function (req, res) {
  if (Object.keys(req.body).length === 0) return res.sendStatus(400);
  console.log(req.body);
  telegramBot.addOrder({
    id: null,
    name: req.body.firstName,
    preferred: req.body.preferred,
    email: req.body.email,
    phone: req.body.phone,
  });
  return res.redirect('/');
});
app.use(express.static(path.join(__dirname, '/public/')));
app.listen = function () {
  var server = http.createServer(app);
  console.log('Server starts working...');
  return server.listen.apply(app);
};
