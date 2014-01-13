var socketIO = require('socket.io');

exports.createChat = function(server) {
	var io = socketIO.listen(server);
	var guestNumber = 1;
	var nicknames = {};
	var namesUsed = {};

	io.sockets.on('connection', function(socket) {
		nicknames[socket.id] = "guest" + guestNumber;
		guestNumber++;

	  socket.on('message', function(msg) {
			var data = nicknames[socket.id] + ": " + msg;
	    io.sockets.emit('message', data);
	  });

		socket.on('nicknameChangeRequest', function(nickname) {
			if (!namesUsed[nickname] && (nickname.slice(0, 5) !== "guest")){
				namesUsed[nickname] = true;
				namesUsed[nicknames[socket.id]] = null;
				nicknames[socket.id] = nickname;
			} else {
				socket.emit('nicknameChangeResult', {
					success: false,
					message: 'Nickname in use!'
				});
			}
		});

		socket.on('disconnect', function() {
			namesUsed[nicknames[socket.id]] = null;
			nicknames[socket.id] = null;
		});

	});
}