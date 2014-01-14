var socketIO = require('socket.io');


exports.createChat = function(server) {
	var io = socketIO.listen(server);
	var guestNumber = 1,
			nicknames = {},
			namesUsed = {},
			currentRooms = {};

	function joinRoom(socket, room) {
		currentRooms[room] = currentRooms[room] || [];
		currentRooms[room].push(socket);
		socket.join(room);
		socket.room = room;
	}

	io.sockets.on('connection', function(socket) {
		nicknames[socket.id] = "guest" + guestNumber;
		guestNumber++;

		joinRoom(socket, "lobby");
		console.log(socket.room);
		var room = socket.room;
		io.sockets.in(room).emit('nicknameList', nicknames);

	  socket.on('message', function(msg) {
			var data = nicknames[socket.id] + ": " + msg;
	    io.sockets.in(room).emit('message', data);
	  });

		socket.on('nickRequest', function(data) {
			var nickname = data[0];
			if (!namesUsed[nickname] && (nickname.slice(0, 5) !== "guest")){
				namesUsed[nickname] = true;
				delete namesUsed[nicknames[socket.id]];
				nicknames[socket.id] = nickname;
				io.sockets.in(room).emit('nicknameList', nicknames);
			} else {
				socket.emit('nicknameChangeResult', {
					success: false,
					message: 'Nickname in use!'
				});
			}
		});


		socket.on('disconnect', function() {
			delete namesUsed[nicknames[socket.id]];
			delete nicknames[socket.id];
		});

	});
}