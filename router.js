function handle(request, response){
	fs.readFile('/index.html', function(err, data) {
		if (err) throw err;
	  response.writeHead(200, {'Content-Type': 'text/html'});
	  response.end(data);
	});
}