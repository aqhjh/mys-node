var net = require('net');


var server = net.createServer(function(socket){

    socket.on('data', function (data) {
        socket.write('你好');
    });
    socket.on('end', function() {
        console.log('链接断开');
    });

    socket.write('欢迎来到nodejs世界');
});

// server.listen(8124, function () {
//     console.log('server bound');
// });

server.listen('/tmp/echo.sock');


