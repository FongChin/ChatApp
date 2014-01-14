var http = require('http');
var fs = require('fs');
var nodeStatic = require('node-static');
var staticServer = new nodeStatic.Server('./public');
var chatServer = require('./lib/chat_server');
var router = require('./router');

var server = http.createServer(function (request, response) {
	router.handle(request, response);
  // request.addListener('end', function () {
  //   staticServer.serve(request, response, function(e, res){
  //   	if (e && (e.status === 404)){
  //   		staticServer.serveFile('/404.html', 404, {}, request, response);
  //   	}
  //   });
  // }).resume();
}).listen(8080);

console.log("logging", chatServer, "/logging");
chatServer.createChat(server);

console.log('Server running at http://127.0.0.1:8080/');