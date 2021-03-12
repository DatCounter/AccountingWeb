var express = require('express');
var path = require('path');

const https = require('https')
const http = require('http')
const app = express();

//change to
http.createServer(app).listen(8083) //80
https.createServer(app).listen(4433) //443

app.use(express.static(path.join(__dirname, '/public/')))
app.listen = function() {
    var server = http.createServer(app);
    return server.listen.apply(app);
}
