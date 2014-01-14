var fs = require('fs');
var cache = {};
var header = {'Content-Type': 'text/html'};

fs.readFile("./public/404.html", function(err, data) {
	cache['/404.html'] = data;
});

exports.handle = function(request, response) {
	function cacheFile(url) {
		fs.readFile("./public" + url, function(err, data) {
			if(err) {
				cache[url] = cache['/404.html'];
			} else {
				cache[url] = data;
				response.end(data);
			}

			response.end(cache[url]);
		});
	}

	function getFile(url) {
		return cache[url] || cacheFile(url);
	}

	function respond(url){
		var file = getFile(url);
		file && response.end(file);
	}

	if (request.url === "/") {
		request.url = "/index.html";
	}

	response.writeHead(200, header);
	respond(request.url);

}

// file
// null