require('dotenv/config');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('AccountingWebDB');

db.serialize(function () {
  db.run(
    'CREATE TABLE users (messageId int PRIMARY KEY NOT NULL, step int, canAdmin bit)',
    function (err) {
      if (err !== null) {
        console.log(err.message);
        console.log('[WARN] Table users already created');
      }
    }
  );
  db.run(
    'CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'name nvarchar(255), phone nvarchar(15), email nvarchar(255), preferred nvarchar(100))',
    function (err) {
      if (err !== null) {
        console.log(err.message);
        console.log('[WARN] Table orders already created');
      }
    }
  );
});

db.close();
console.log('Databases created');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const https = require('https');
const http = require('http');
const app = express();
const telegram = require('./telegram');
const { Console } = require('console');
const telegramBot = new telegram.TelegramBot();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

if (telegramBot.start()) {
  console.log('Bot starts working...');
}

http.createServer(app).listen(8081); //80
//https.createServer(app).listen(443); //443

app.post('/addOrder', urlencodedParser, function (req, res) {
  if (Object.keys(req.body).length === 0) return res.sendStatus(400);

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
