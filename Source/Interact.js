const readline = require("readline-sync")
const Output = require("./print");
const Input = require("./Input");
const fs = require("fs");
const request = require('request');
const shell = require('shelljs');
require('shelljs-plugin-open');
const UI = require("./window");
var opn = require('opn');

var screen;
var body;
var inputBar;
var notification;
var FriendList = null;
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
//	console.log(FriendList);
	if(FriendList === null){
		api.getFriendsList((err, data) => {
	    if(err){
	    	console.error(err);
	    	return getFriendList(api);
		}

		FriendList = data;
	    id = Input.getName(data);
	    if(id.length == 1){
    		userid = data[id].userID;
    		name = data[id].fullName;	
    		listenCallback(api,userid,name);
    	}else{
    		detail = Input.GetSingleOption(id, data);
    		userid = detail[0];
    		name = detail[1];	
    		listenCallback(api,userid,name);
    	}
	    });
    }else{
	    id = Input.getName(FriendList);
	    if(id.length == 1){
    		userid = FriendList[id].userID;
    		name = FriendList[id].fullName;	
    		listenCallback(api,userid,name);
    	}else{
    		detail = Input.GetSingleOption(id, FriendList);
    		userid = detail[0];
    		name = detail[1];	
    		listenCallback(api,userid,name);
    	}    	
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
	button = UI.getButton();
	body = UI.getbody();
	
	api.getThreadHistory(id, 10, null, (err, history) => {
        if(err){
         	UI.log(err);
         	return listenCallback(api, id, name);
    	};    
    	if(history.length == 0){
    		UI.log("start a new conversation...");
    	}
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
    UI.log("yo");
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
		inputBar.focus();
    });
    button.on("click",function(){
    	sendImage(api,id);
    });
}

function sendImage(api,id){
	send = UI.getSend();
	screen = UI.getscreen();
	UI.log("copy past the doc in the folder opened ")
	shell.mkdir('-p' , './sent');
	var dir = './SentItem'
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
	shell.open("sent");
	screen.append(send);
	UI.log("Press the green button when done...");
	send.on("click",function(){
		files = shell.ls('sent');
    	messages = [];
	    for(var file = 0 ; file < files.length ; file++)
	    {
    		
	    	var message = {
		    	body: "",
		    	// console.log(shell.ls('sent')[]);
		    	
	        	attachment: fs.createReadStream("sent/"+shell.ls('sent')[file]),

    		}	

    		api.sendMessage(message, id,function(){
	    		UI.log("You: (sent an attachment)");
    			shell.rm('-rf',"sent/"+shell.ls('sent')[file]);
	    	});
	    }
	    // fs.appendFile("SentItem/"+shell.ls('sent')[file], attch,function(){});
	    // copyFile("sent/"+shell.ls('sent')[file],'SentItem');
    	// shell.rm('-rf','sent');
	    // console.log(data[id-1]);
	    
		send.destroy();
		
		
	});
}


function Message(api,id,text){
	if(text.match("@menu")){
		screen.destroy();
		markRead(api,id);	
	}else if("@displaydp"){
		displaydp(id);
	}else{
		api.sendMessage(text, id);
		inputBar.clearValue();
		UI.log("You: "+text);		
	}
}

function displaydp(id){
	opn("https://graph.facebook.com/"+id+"/picture?type=large&redirect=true&width=500&height=500");
}

function markRead(api, id){
	api.markAsRead(id, (err, ret) => {
		if(err){
			return markRead(api, id);
		}
		unreadThreads(api);
	});
}

var copyFile = (file, dir2)=>{
  //include the fs, path modules
  var fs = require('fs');
  var path = require('path');

  //gets file name and adds it to dir2
  var f = path.basename(file);
  var source = fs.createReadStream(file);
  var dest = fs.createWriteStream(path.resolve(dir2, f));

  source.pipe(dest);
  
  
};
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