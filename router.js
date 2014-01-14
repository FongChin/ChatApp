var fs = require('fs');

exports.handle = function(request, response) {
	if (request.url === "/") {
		request.url = "/index.html";
	}
	request.url = "./public" + request.url;
	fs.readFile(request.url, function(err, data) {
		if(err) {
			fs.readFile('./public/404.html', function(err, msg) {
			  response.writeHead(404, {'Content-Type': 'text/html'});
			  response.end(msg);
			});
			console.log("error");
		} else {
		  response.writeHead(200, {'Content-Type': 'text/html'});
		  response.end(data);
			console.log("no error")
		}
	});

}