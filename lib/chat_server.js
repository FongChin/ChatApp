var socketIO = require('socket.io');

exports.createChat = function(server) {
	var io = socketIO.listen(server);

	io.sockets.on('connection', function (socket) {
	  // socket.emit('news', { hello: 'world' });

	  socket.on('message', function (data) {
	    io.sockets.emit('message', data);
	  });
	});
}