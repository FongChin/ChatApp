var socketIO = require('socket.io');

function NicknameManager() {
	this.nicknames = {};
	this.namesUsed = {};
}

NicknameManager.prototype = {
	get: function(socketId){
		return this.nicknames[socketId];
	},

	set: function(socketId, value){
		this.nicknames[socketId] = value;
		this.namesUsed[value] = true;
	},

	exists: function(name){
		return this.namesUsed[name];
	},

	delete: function(id){
		var nickname = this.nicknames[id];
		delete this.nicknames[id];
		delete this.namesUsed[nickname];
	}
}

exports.createChat = function(server) {
	var io = socketIO.listen(server);
	var guestNumber = 1,
			nicknameManager = new NicknameManager(),
			// nicknames = {},
			// namesUsed = {},
			currentRooms = {};

	function joinRoom(socket, room) {
		currentRooms[room] = currentRooms[room] || [];
		currentRooms[room].push(socket);
		socket.join(room);
		socket.room = room;
		socket.emit('changeRoom', room);

		updateUsers(room);
	}

	function updateUsers(room) {
		var users = currentRooms[room].map(function(socket) {
			return nicknameManager.get(socket.id);
		});
		io.sockets.in(room).emit('nicknameList', users);
	}

	function leaveRoom(socket) {
		var room = currentRooms[socket.room];
		socket.leave(socket.room);

		var i = room.indexOf(socket);
		if(i > -1) {
			room.splice(i, 1);
		}

		updateUsers(socket.room);
	}

	io.sockets.on('connection', function(socket) {
		nicknameManager.set(socket.id, "guest" + guestNumber);
		guestNumber++;

		joinRoom(socket, "lobby");
		console.log(socket.room);


	  socket.on('message', function(msg) {
			var data = nicknameManager.get(socket.id) + ": " + msg;
	    io.sockets.in(socket.room).emit('message', data);
	  });

		socket.on('nickRequest', function(data) {
			var nickname = data[0];
			if (!nicknameManager.exists(nickname)
					&& (nickname.slice(0, 5) !== "guest")){
				nicknameManager.delete(socket.id);
				nicknameManager.set(socket.id, nickname);
				updateUsers(socket.room);
			} else {
				socket.emit('nicknameChangeResult', {
					success: false,
					message: 'Nickname in use!'
				});
			}
		});

		socket.on('joinRequest', function(data) {
			var newRoom = data[0];
			leaveRoom(socket);
			joinRoom(socket, newRoom);
		});


		socket.on('disconnect', function() {
			leaveRoom(socket);
			nicknameManager.delete(socket.id);
		});
	});
}