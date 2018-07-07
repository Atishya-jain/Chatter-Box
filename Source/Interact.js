const readline = require("readline-sync")
//const Input = require("./Input");
const fs = require("fs");
const blessed = require('blessed');

var screen;
var body;
var inputBar;
function log(text) {
  body.pushLine(text);
  screen.render();
}


// listens for the messages on messenger 
function listen(api){
	displayFriendList(api);
}


function createWindows(){
	screen = blessed.screen({
	  smartCSR: true
	});
	body = blessed.box({
	  top: 0,
	  left: 0,
	  height: '100%-1',
	  width: '100%',
	  keys: true,
	  mouse: true,
	  alwaysScroll: true,
	  scrollable: true,
	  scrollbar: {
	    ch: ' ',
	    bg: 'red'
	  },
	  smartCSR: true
	});
	inputBar = blessed.textbox({
	  bottom: 0,
	  left: 0,
	  height: 1,
	  width: '100%',
	  keys: true,
	  mouse: true,
	  focused: true,
	  inputOnFocus: true,
	  style: {
	    fg: 'white',
	    bg: 'blue'  // Blue background so you see this is different from body
	  }
	});

	// Add body to blessed screen
	screen.append(body);
	screen.append(inputBar);

	// Close the example on Escape, Q, or Ctrl+C
	screen.key(['escape', 'q', 'C-c'], (ch, key) => (process.exit(0)));
	inputBar.key(['escape', 'C-c'], (ch, key) => (process.exit(0)));

}

function displayFriendList(api){
	api.getFriendsList((err, data) => {
	    if(err) return log(err);
	    i = 1;
	    for(var person in data){
	    	console.log(i + " " + data[person].firstName);
	    	i++;
	    }
	    id = readline.question("Enter an the id of the person you want to chat with: ");
	    userid = data[id-1].userID;
	    name = data[id-1].fullName;
	    listenCallback(api,userid,name);
    });
}



function listenCallback(api,id,name){
	createWindows();
	log("yo");
	api.listen((err, message) => {
    	
		if(message){
			

			// get the username by using senderID that we received from the message
	    	api.getUserInfo(message.senderID,function(err,ret){
				if(message.senderID == id)
				
					
		            
		                log(name + " : " + message.body);
		               	if(message.attachments.length > 0){
							for(attachment in message.attachments){
								
						 		
								if(message.attachments[attachment].type == "photo"){
									var dir = './Photo'
									if (!fs.existsSync(dir)){
    									fs.mkdirSync(dir);
									}
									var dir = './Photo/'+ name;

									if (!fs.existsSync(dir)){
    									fs.mkdirSync(dir);
									}
									download(message.attachments[attachment].url, dir + "/" + message.attachments[attachment].name, function(){
										shell.open(dir + "/" + message.attachments[attachment].name);
				  						log('a photo sent by ' + name);
									});
								}
							}
						} 	
		            
	        	
				

	    	});
    	}
    });

	inputBar.on("submit",function(text){
		Message(api,id,text);
    });
}


function Message(api,id,text){
	api.sendMessage(text, id);
	inputBar.clearValue();
	log("You: "+text);
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