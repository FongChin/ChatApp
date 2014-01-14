(function(root){
	var ChatApp = root.ChatApp = (root.ChatApp || {});

	var Chat = ChatApp.Chat = function(socket){
		this.socket = socket;

		socket.on('message', function(data) {
			var newMessage = $('<div>').text(data);
			$("#message-box").append(newMessage);
		});

		socket.on('nicknameChangeResult', function(data){
			alert(data.message);
		});

		socket.on('nicknameList', function(nicknames){
			var user_field = $("#users").empty();
			$.each(nicknames, function(index, value){
				user_field.append($("<li>").text(value));
			});
		});

		socket.on('changeRoom', function(room){
			this.room = room;
		});
	}

	Chat.commands = ["nick", "join"];

	Chat.prototype.sendMessage = function(data) {
		this.socket.emit("message", data);
	}

	Chat.prototype.setNickname = function(nick) {
		this.socket.emit("nicknameChangeRequest", nick);
	}

	Chat.prototype.processCommand = function(str) {
		var args = str.split(' ');
		if (Chat.commands.indexOf(args[0]) > -1){
			this.socket.emit(args[0] + "Request", args.slice(1));
		} else{
			alert("event not found");
		}
	}
})(this);