//tell node to create a new http server using its http module. Requests to this server trigger the 
//enclosed function. Basic router 

var http = require('http');
var url = require("url");
var fs = require('fs');
var httpRequest = require('request');

var server = http.createServer(function(request, response) {
    var path = url.parse(request.url).pathname;
    switch(path) {
        case '/':

        fs.readFile(__dirname + '/index.html', function(error, data){
            if(error) {
                response.writeHead(404);
                respose.write('Error - Page Not Found');
                response.end();
            } else {
                response.writeHead(200, {'Content-Type':'text/html'});
                response.write(data, 'utf8');
                response.end();
            }
        })
        break;
        case '/styles.css':
        fs.readFile(__dirname + '/styles.css', function(error, data){
            if(error) {
                response.writeHead(404);
                respose.write('Error - Page Not Found');
                response.end();
            } else {
                response.writeHead(200, {'Content-Type':'text/css'});
                response.write(data, 'utf8');
                response.end();
            }
        })
        break;
        default:
            response.writeHead(200, {'Content-Type':'text/html'});
            response.write('Error - page not found');
            response.end();
            break;
    }
});

server.listen(8000);


var io = require('socket.io').listen(server);
var priceUrl = 'https://blockchain.info/ticker';
var price = 0;

io.on('connection', function(socket){
    console.log('Client connected');
    setInterval(function(){
        httpRequest(priceUrl, function(error, response, body){
            try {
                price = JSON.parse(body).GBP.buy;
            } catch(e) {
                console.log('Couldn\' get price from API');
            }
        });
        console.log('Emitting update \(' + price + '\).');
        socket.emit('stream', {'price':price});
    }, 1000);
})