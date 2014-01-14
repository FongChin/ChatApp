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
				cache[url] = { status: 404, body: cache['/404.html'] };
			} else {
				cache[url] = { status: 200, body: data };
			}

			post(cache[url]);
		});
	}

	function post(file) {
		response.writeHead(file.status, header);
		response.end(file.body);
	}

	function getFile(url) {
		return cache[url] || cacheFile(url);
	}

	function respond(url){
		var file = getFile(url);
		file && post(file);
	}

	if (request.url === "/") {
		request.url = "/index.html";
	}

	respond(request.url);

}

// file
// null