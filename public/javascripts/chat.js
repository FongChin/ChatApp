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
	}

	Chat.prototype.sendMessage = function(data) {
		this.socket.emit("message", data);
	}

	Chat.prototype.setNickname = function(nick) {
		this.socket.emit("nicknameChangeRequest", nick);
	}
})(this);