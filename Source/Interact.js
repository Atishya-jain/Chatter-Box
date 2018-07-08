const readline = require("readline-sync")
const Output = require("./print");
const Input = require("./Input");
const fs = require("fs");
const request = require('request');
const shell = require('shelljs');
require('shelljs-plugin-open');
const UI = require("./window");

var screen;
var body;
var inputBar;
var notification;
var FirendList = null;
// // listens for the messages on messenger 
// function listen(api){
// 	console.log("\033c");
// 	displayFriendList(api);
// }

function unreadThreads(api){
	console.log("\033c");
	api.getThreadList(100, null, ["INBOX", "unread"], function(err, list){
		if(err){
			console.error(err);		 // May remove later
			return unreadThreads(api)
		};
		var i = 1;
		// Displaying all unreads
		for(item in list){
			console.log(i+"\033[1m"+list[item].name + " : " + list[item].snippet+"\033[0m");
			i++;
		}

	 	if(list.length == 0){
			Output.PrintChoice(api, false);
		}else{
			Output.PrintChoice(api, true);
		}
		
		getFriendList(api);
	});
}

function getFriendList(api){
//	console.log(FirendList);
	if(FirendList === null){
		api.getFriendsList((err, data) => {
	    if(err){
	    	console.error(err);
	    	return getFriendList(api);
		}

		FirendList = data;
	    id = Input.getName(data);
    	console.log(id);
    	userid = data[id].userID;
    	name = data[id].fullName;	
    	listenCallback(api,userid,name);
	    });
    }else{
	    id = Input.getName(FirendList);
    	console.log(id);
    	userid = FirendList[id].userID;
    	name = FirendList[id].fullName;	
    	listenCallback(api,userid,name);    	
    }	
}


// function displayFriendList(api){
// 	api.getFriendsList((err, data) => {
// 	    if(err){
// 	    	log(err);
// 	    	return displayFriendList(api);
// 		};
// 	    i = 1;
// 	    for(var person in data){
// 	    	console.log(i + " " + data[person].firstName);
// 	    	i++;
// 	    }
// 	    id = readline.question("Enter an the id of the person you want to chat with: ");
// 	    userid = data[id-1].userID;
// 	    name = data[id-1].fullName;
// 	    listenCallback(api,userid,name);
//     });
// }

function listenCallback(api,id,name){

	UI.createWindows();
	screen = UI.getscreen();
	inputBar = UI.getinputBar();
	notification = UI.getnotification();
	body = UI.getbody();

	api.getThreadHistory(id, 10, null, (err, history) => {
        if(err){
         	UI.log(err);
         	return listenCallback(api, id, name);
    	};    
        for(item in history){
        	if(history[item].senderID == history[item].threadID){
        		
        		if(history[item].isUnread){
        			if(history[item].attachments.length == 0){
        				UI.log("\033[1m"+name + " : " + history[item].body + "\033[0m");
        			}else{
        				UI.log("\033[1m"+name + " : " + history[item].body + " (Sent an attachment)" + "\033[0m");
        			}
        		}else{
        			if(history[item].attachments.length == 0){
        				UI.log(name + " : " + history[item].body);
        			}else{
        				UI.log(name + " : " + history[item].body + " (Sent an attachment)");
        			}
        			
        		}


        	}else{
        		if(history[item].attachments.length == 0){
    				UI.log("You : " + history[item].body);
    			}else{
    				UI.log("You : " + history[item].body + " (Sent an attachment)");
    			}
        	}
        }
        
    });
    api.listen((err, message) => {
    	
		if(message){
			

			// get the username by using senderID that we received from the message
	    	api.getUserInfo(message.senderID,function(err,ret){
				if(message.senderID == id)
				
				{						
	            
	                
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
			  						UI.log(name + " : " + message.body + "(sent an attachment)");
								});
							}
						}
					}else{
						UI.log(name + " : " + message.body);
					} 	
	            
	        	}else{
	        		api.getUserInfo(message.senderID, (err, ret) => {
				        if(err) return UI.log(err);

				        for(var prop in ret) {
				            if(ret.hasOwnProperty(prop)) {
				            	if(message.attachments.length == 0)
				                {
				                	
				                	UI.lognotification(ret[prop].name + " : " + message.body);
			                	}else{
			                		
			                		UI.lognotification(ret[prop].name + " : Sent an attachment");	
			                	}
				            }
				        }
    				});
	        	}
				

	    	});
    	}
    });

	inputBar.on("submit",function(text){
		Message(api,id,text);
    });
}


function Message(api,id,text){
	if(text.match("@menu")){
		markRead(api,id);	
	}else{
		api.sendMessage(text, id);
		inputBar.clearValue();
		UI.log("You: "+text);		
	}
}

function markRead(api, id){
	api.markAsRead(id, (err, ret) => {
		if(err){
			return markRead(api, id);
		}
		unreadThreads(api);
	});
}
// //sends messages
// function sendmessage(err, api,ask){
	
//     if(err){
//     	console.error(err);
//     	return sendmessage(err,api,ask);
//     };
    
//     api.getFriendsList((err, data) => {
// 	    if(err) return console.error(err);
// 	    i = 1;
// 	    for(var person in data){
// 	    	console.log(i + " " + data[person].firstName);
// 	    	i++;
// 	    }
// 	    //console.log("Enter an the id of the person you want to message: ");
// 	    //id = readline.question(">> ");

// 		var id = readline.question("Who do you want to talk:(enter sno.)>> ");
// 		var userID = list[id-1].threadID;
// 		var name = list[id-1].name;

// 	    listenCallback(api, userID, name);
// 	    //message = readline.question("message: ");
// 	    //console.log(data[id-1]);
// 	    //api.sendMessage(message, data[id-1].userID,function(){
// 	    //	ask(err, api);
// 	    //});
//     });
// }


var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

module.exports = {
//	'listen': listen,
//	'sendmessage': sendmessage,
	'download': download,
	'unreadThreads':unreadThreads,
}