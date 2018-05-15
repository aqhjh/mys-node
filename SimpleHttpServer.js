var http = require('http');
var xrouter = require('./Router.js').router;
var fs = require('fs');
var path = require('path');


xrouter.register('/', function (req, res) {

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('hello, world');
});

xrouter.register('/home', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('Home page');
});

xrouter.register('/static', function (req, res) {

    let url = path.resovle('.') + req.url;
    let file = fs.readFileSync(url, {encoding: 'utf-8'});
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age="1000"'
    });
    res.end(file);
});





var server = http.createServer(function(req, res) {
    xrouter.use(req, res);

    // res.writeHead(200, {
    //     'Context-Type': 'text/plain'
    // });
    // res.end('Hello world!');
});

server.listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');