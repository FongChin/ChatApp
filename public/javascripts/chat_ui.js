(function(root){
	var ChatApp = root.ChatApp = (root.ChatApp || {});

	var ChatUI = ChatApp.ChatUI = function(){
		this.socket = io.connect();
		this.chat = new ChatApp.Chat(this.socket);
	}

	ChatUI.prototype.getMessage = function(){
		var message = $("#input-message").val();
		$("#input-message").val("");
		return message;
	}

	ChatUI.prototype.sendMessage = function(){
		var msg = this.getMessage();
		this.chat.sendMessage(msg);
	}

})(this);

$(function(){
	var chatUI = new ChatApp.ChatUI();

	var performSend = chatUI.sendMessage.bind(chatUI);

	$('#send-message').on('click', performSend);
	$('#input-message').on('keypress', function(event) {
		if(event.keyCode == 13) {
			performSend();
		}
	});
});