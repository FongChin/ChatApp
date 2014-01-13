(function(root){
	var ChatApp = root.ChatApp = (root.ChatApp || {});

	var Chat = ChatApp.Chat = function(socket){
		this.socket = socket;

		socket.on('message', function(data) {
			var newMessage = $('<div>').text(data);
			$("#message-box").append(newMessage);
		});
	}

	Chat.prototype.sendMessage = function(data){
		this.socket.emit("message", data);
	}
})(this);