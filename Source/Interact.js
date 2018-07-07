const readline = require("readline-sync")
//const Input = require("./Input");
const fs = require("fs");


// listens for the messages on messenger 
function listen(api,ask){
    api.listen((err, message) => {    	
		if(message){
			// get the username by using senderID that we received from the message
	    	api.getUserInfo(message.senderID,function(err,ret){
				for(var prop in ret) {
		            if(ret.hasOwnProperty(prop)) {
		                console.log(ret[prop].name + " : " + message.body);
		               	if(message.attachments.length > 0){
							for(attachment in message.attachments){
								if(message.attachments[attachment].type == "photo"){
									var dir = './Photo'
									if (!fs.existsSync(dir)){
    									fs.mkdirSync(dir);
									}
									var dir = './Photo/'+ ret[prop].name;

									if (!fs.existsSync(dir)){
    									fs.mkdirSync(dir);
									}
									download(message.attachments[attachment].url, dir + "/" + message.attachments[attachment].name, function(){
				  						console.log('a photo sent by ' + ret[prop].name);
									});
								}
							}
						} 	
		            }
	        	}
	    	});
    	}
    });
}



//sends messages
function sendmessage(err, api, ask){
	
    if(err) return console.error(err);
    
    api.getFriendsList((err, data) => {
	    if(err) return console.error(err);
	    i = 1;
	    for(var person in data){
	    	console.log(i + " " + data[person].firstName);
	    	i++;
	    }
	    console.log("Enter an the id of the person you want to message: ");
	    id = readline.question(">> ");
	    message = readline.question("message: ");
	    //console.log(data[id-1]);
	    api.sendMessage(message, data[id-1].userID,function(){
	    	ask(err, api);
	    });
    });
}



var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

module.exports = {
	'listen': listen,
	'sendmessage': sendmessage,
	'download': download
}