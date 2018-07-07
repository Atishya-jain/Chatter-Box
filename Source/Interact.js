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
	console.log("\033c");
	displayFriendList(api);
}

function unreadThreads(api){
	console.log("\033c");
	api.getThreadList(100, null, ["INBOX", "unread"], function(err, list){
		if(err) console.log(error);
		var i = 1;
		for(item in list){
			console.log(i+"\033[1m"+list[item].name + " : " + list[item].snippet+"\033[0m");
			i++;
		}

		var id = readline.question("Who do you want to talk:(enter sno.)>> ");
		var userID = list[id-1].threadID;
		var name = list[id-1].name;
		listenCallback(api,userID,name)
	});
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
	
	api.getThreadHistory(id, 10, null, (err, history) => {
        if(err) return log(err);    
        for(item in history){
        	if(history[item].senderID == history[item].threadID){
        		if(history[item].isUnread){
        			log("\033[1m"+name + " : " + history[item].body);
        		}else{
        			log(name + " : " + history[item].body);
        		}
        	}else{
        		log(" You : " + history[item].body);
        	}
        }
        
    });
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
function sendmessage(err, api,ask){
	
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
	'download': download,
	'unreadThreads':unreadThreads,
}