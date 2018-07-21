const readline = require("readline-sync")
const Output = require("./print");
const Input = require("./Input");
const fs = require("fs");
const request = require('request');
const shell = require('shelljs');
require('shelljs-plugin-open');
const UI = require("./window");
var opn = require('opn');
var blessed = require('blessed');

var screen;
var body;
var inputBar;
var notification;
var FriendList = null;
var GroupList = null;
var send;
var unreadThreadsList = null;
var issendImage = false;

var auto = null;

// // listens for the messages on messenger 
// function listen(api){
// 	console.log("\033c");
// 	displayFriendList(api);
// }



// Function to display unread threads of a user
function unreadThreads(api){
	console.log("\033c");
	if(unreadThreadsList == null)
	{
		api.getThreadList(100, null, ["INBOX", "unread"], function(err, list){
			if(err){
				console.error(err);		 // May remove later
				return unreadThreads(api)
			};
			var i = 1;
			unreadThreadsList = list;
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
	}else{
		var i = 1;
		for(item in unreadThreadsList){
				console.log(i+"\033[1m"+unreadThreadsList[item].name + " : " + unreadThreadsList[item].snippet+"\033[0m");
				i++;
			}
			if(unreadThreadsList.length == 0){
				Output.PrintChoice(api, false);
			}else{
				Output.PrintChoice(api, true);
			}
			getFriendList(api);
	}
}

// Function to fetch friendlist and grouplist to store
function getFriendList(api){
	// If both of them are not defined
	if((FriendList === null) && (GroupList === null)){
		api.getFriendsList((err, data) => {
		    if(err){
		    	console.error(err);
		    	return getFriendList(api);
			}
			FriendList = data;
		    
			api.getThreadList(1000, null, [], function(err,list){
				if(err){
			    	console.error(err);
			    	return getFriendList(api);
				}			
				GroupList = [];
				for(item in list){
					if(list[item].isGroup && list[item].name){
						GroupList.push(list[item]);
					}
				}

				id = Input.getName(FriendList, GroupList);
			    if((id[0].length == 1) && (id[1].length == 0)){
		    		userid = FriendList[id[0][0]].userID;
		    		name = FriendList[id[0][0]].fullName;
					listenCallback(api,userid,name);
				}else if((id[0].length == 0) && (id[1].length == 1)){
		    		userid = GroupList[id[1][0]].threadID;
		    		name = GroupList[id[1][0]].name;
		    		groupListenCallback(api, userid);
		    	}else{
		    		detail = Input.GetSingleOption(id, FriendList, GroupList);
		    		userid = detail[0];
		    		name = detail[1];
					if(!detail[2]){
			    		listenCallback(api,userid,name);
					}else{
						groupListenCallback(api,userid);
					}
		    	}
			});			
    	});
	// If friendlist is defined but not grouplist
    }else if(GroupList === null){
		api.getThreadList(1000, null, [], function(err,list){
			if(err){
		    	console.error(err);
		    	return getFriendList(api);
			}			
			GroupList = [];
			for(item in list){
				if(list[item].isGroup && list[item].name){
					GroupList.push(list[item]);
				}
			}
			id = Input.getName(FriendList, GroupList);
		    if((id[0].length == 1) && (id[1].length == 0)){
	    		userid = FriendList[id[0][0]].userID;
	    		name = FriendList[id[0][0]].fullName;
				listenCallback(api,userid,name);
			}else if((id[0].length == 0) && (id[1].length == 1)){
	    		userid = GroupList[id[1][0]].threadID;
	    		name = GroupList[id[1][0]].name;
	    		groupListenCallback(api, userid);
	    	}else{
	    		detail = Input.GetSingleOption(id, FriendList, GroupList);
	    		userid = detail[0];
	    		name = detail[1];
				if(!detail[2]){
		    		listenCallback(api,userid,name);
				}else{
					groupListenCallback(api,userid);
				}
	    	}
		});			
	// If both are defined, so just get the correct person
    }else{
	    id = Input.getName(FriendList, GroupList);
	    if((id[0].length == 1) && (id[1].length == 0)){
    		userid = FriendList[id[0][0]].userID;
    		name = FriendList[id[0][0]].fullName;
			listenCallback(api,userid,name);
		}else if((id[0].length == 0) && (id[1].length == 1)){
    		userid = GroupList[id[1][0]].threadID;
    		name = GroupList[id[1][0]].name;
    		groupListenCallback(api, userid);
    	}else{
    		detail = Input.GetSingleOption(id, FriendList, GroupList);
    		userid = detail[0];
    		name = detail[1];
			if(!detail[2]){
	    		listenCallback(api,userid,name);
			}else{
				groupListenCallback(api,userid);
			}
    	}
	}    	
}	


function listenCallback(api,id,name){

	UI.createWindows();
	screen = UI.getscreen();
	inputBar = UI.getinputBar();
	notification = UI.getnotification();
	button = UI.getButton();
	body = UI.getbody();
	threads = UI.getthreads();

	displayUnreadThreads();
	api.getThreadHistory(id, 10, null, (err, history) => {
 
        for(item in history){
        	
    		if(history[item].senderID == history[item].threadID){
        		
        		if(history[item].isUnread){
        			if(history[item].attachments.length == 0){
        				UI.log("\033[33;1;1m"+name + " : " + history[item].body + "\033[0m");
        			}else{
        				UI.log("\033[33;1;1m"+name + " : " + history[item].body + " (Sent an attachment)" + "\033[0m");
        			}
        		}else{
        			if(history[item].attachments.length == 0){
        				UI.log("\033[32;1m" + name + " : " + history[item].body + "\033[0m");
        			}else{
        				UI.log("\033[32;1m" + name + " : " + history[item].body + " (Sent an attachment)" + "\033[0m");
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
    	
		var pos = -1;
		if(auto){
			for(i in auto){
				if(auto[i].id == message.senderID){
					api.sendMessage(auto[i].msg, message.senderID);
					break;
				}
			}
		}

    	

		if(message){
			
			// get the username by using senderID that we received from the message
	    	api.getUserInfo(message.senderID,function(err,ret){
				if(message.senderID == id)				
				{						
	            
	               	if(message.attachments.length > 0){
						for(attachment in message.attachments){
							// if(message.attachments[attachment].type == "photo"){
								var dir = './Photo'
								if (!fs.existsSync(dir)){
									fs.mkdirSync(dir);
								}
								var dir = './Photo/'+ name;

								if (!fs.existsSync(dir)){
									fs.mkdirSync(dir);
								}
								download(message.attachments[attachment].url, dir + "/" + message.attachments[attachment].name, function(){
									opn(message.attachments[attachment].url);
									shell.open(dir + "/" + message.attachments[attachment].name);
			  						UI.log("\033[32;1m" + name + " : " + message.body + "(sent an attachment)" + "\033[0m");
								});
							// }
						}
					}else{
						UI.log("\033[32;1m" + name + " : " + message.body + "\033[0m");
					} 	
	            
	        	}else{
	        		api.getUserInfo(message.senderID, (err, ret) => {
				        if(err) return UI.log(err);

				        for(var prop in ret) {
				            if(ret.hasOwnProperty(prop)) {
				            	var pos = -1;
				            	for(thread in unreadThreadsList){
				            		if(unreadThreadsList[thread].name == ret[prop].name){
				            			pos = thread;
				            		}
				            	}
				            	if(message.attachments.length == 0)
				                {
				                	UI.lognotification(ret[prop].name + " : " + message.body);
				                	if(pos == -1){
				                		unreadThreadsList.unshift({'name':ret[prop].name,'snippet':message.body});
				                	}else{
			                			unreadThreadsList[pos].snippet = message.body;
				                	}
				                					                				                	
			                	}else{
			                		UI.lognotification(ret[prop].name + " : Sent an attachment");	
			                		if(pos == -1){
			                			unreadThreadsList.unshift({'name':ret[prop].name,'snippet':message.body});
				                	}else{
			                			unreadThreadsList[pos].snippet = "Sent an attachment";
				                	}
			                	}
	                			displayUnreadThreads();
				            }
				        }
    				});
	        	}
				

	    	});
    	}
    });

	inputBar.on("submit",function(text){
		if(issendImage){
			sendattachment(api,id,text);
			issendImage = false;
			inputBar.focus();	
		}else{
			Message(api,id,text);
			inputBar.focus();	
		}
		
    });
    button.on("click",function(){
    	sendImage(api,id);
    });
}
function displayUnreadThreads(){
	threads = UI.getthreads();
	threads.setContent("");
	for(thread in unreadThreadsList){
		UI.logthreads(unreadThreadsList[thread].name + ":" +unreadThreadsList[thread].snippet);
		UI.logthreads("\n");
	}
}

function groupListenCallback(api,id){
	var groupMember;
	api.getThreadInfo(id,function(err,info){
		if(err){
			console.log(err);
			return groupListenCallback(api, id);
		}
		var ids = info.participantIDs;
		names = [];
		api.getUserInfo(ids, (err, ret) => {
	        for(var prop in ret) {
	            if(ret.hasOwnProperty(prop)) {
	                names.push(ret[prop].name);
	                
	            }
	        }
	        
	        startGroupChat(api,ids,names,id);
	    });
		
	});
}

function startGroupChat(api,ids,names,id){
	UI.createWindows();
	screen = UI.getscreen();
	inputBar = UI.getinputBar();
	notification = UI.getnotification();
	button = UI.getButton();
	body = UI.getbody();
	send = UI.getSend();
	
	displayUnreadThreads();
	api.getThreadHistory(id, 10, null, (err, history) => {
        for(item in history){
        	
    		name = names[ids.indexOf(history[item].senderID)];

        		
        		if(history[item].isUnread){
        			if(history[item].attachments.length == 0){
        				UI.log("\033[33;1;1m"+name + " : " + history[item].body + "\033[0m");
        			}else{
        				UI.log("\033[33;1;1m"+name + " : " + history[item].body + " (Sent an attachment)" + "\033[0m");
        			}
        		}else{
        			if(history[item].attachments.length == 0){
        				UI.log("\033[32;1m" + name + " : " + history[item].body + "\033[0m");
        			}else{
        				UI.log("\033[32;1m" + name + " : " + history[item].body + " (Sent an attachment)" + "\033[0m");
        			}
        			
        		}


        	
    	}
    	
	});

	api.listen((err, message) => {
    	
		var pos = -1;
		if(auto){
			for(i in auto){
				if(auto[i].id == message.senderID){
					api.sendMessage(auto[i].msg, message.senderID);
					break;
				}
			}
		}

		if(message){
			

			// get the username by using senderID that we received from the message
	    	api.getUserInfo(message.threadID,function(err,ret){
				if(message.threadID == id)
				
				{						
	            
	                name = names[ids.indexOf(message.senderID)];
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
			  						UI.log("\033[32;1m" + name + " : " + message.body + "(sent an attachment)") +"\033[0m";
								});
							}
						}
					}else{
						UI.log("\033[32;1m" + name + " : " + message.body + "\033[0m");
					} 	
	            
	        	}else{
	        		api.getUserInfo(message.senderID, (err, ret) => {
				        if(err) return UI.log(err);

				        for(var prop in ret) {
				            if(ret.hasOwnProperty(prop)) {
				            	var pos = -1;
				            	for(thread in unreadThreadsList){
				            		if(unreadThreadsList[thread].name == ret[prop].name){
				            			pos = thread;
				            		}
				            	}
				            	if(message.attachments.length == 0)
				                {
				                	UI.lognotification(ret[prop].name + " : " + message.body);
				                	if(pos == -1){
				                		unreadThreadsList.unshift({'name':ret[prop].name,'snippet':message.body});
				                	}else{
			                			unreadThreadsList[pos].snippet = message.body;
				                	}
				                	
				                
				                	
			                	}else{
			                		UI.lognotification(ret[prop].name + " : Sent an attachment");	
			                		if(pos == -1){
			                			unreadThreadsList.unshift({'name':ret[prop].name,'snippet':message.body});
				                	}else{
			                			unreadThreadsList[pos].snippet = "Sent an attachment";
				                	}
			                	}
	                			displayUnreadThreads();
				            }
				        }
    				});
	        	}
				

	    	});
    	}
    });
    inputBar.on("submit",function(text){
		if(issendImage){
			sendattachment(api,id,text);
			issendImage = false;
			inputBar.focus();	
		}else{
			Message(api,id,text);
			inputBar.focus();
		}
    });
    button.on("click",function(){
    	sendImage(api,id);
    });
}

function sendattachment(api,id,text){
	UI.log("sending");
	inputBar = UI.getinputBar();
	inputBar.clearValue();
	
	shell.mkdir("send");
	shell.cp(text , "send");

	var message = {
    	body: "",
    	attachment: fs.createReadStream("send/"+shell.ls('send')[0]),

	}	

	api.sendMessage(message, id,function(){
		UI.log("You : (sent an attachment)");
		shell.rm('-rf',"send/");
	});
    


}


function sendImage(api,id){
	UI.log("Drag and drop the image in the input bar!! and press enter");
	issendImage = true;
}


function Message(api,id,text){
	inputBar = UI.getinputBar();
	if(text.toLowerCase() == "@menu"){
		screen.destroy();
		unreadThreadsList = null;
		markRead(api,id);	
	}else if(text.toLowerCase() == "@dp"){
		inputBar.clearValue();
		displaydp(id);
		
	}else if(text.toLowerCase() == "@groups"){
		unreadThreadsList = null;
		screen.destroy(function(){displaygroups(api)});
		

		
	}else if(text.toLowerCase() == "@autostop"){
		
		if(auto){
			for(i in auto){
				if(auto[i].id == id){
					auto.splice(i,1);
				}
			}
		}
		
		UI.log("automatic msg stop ");
		inputBar.clearValue();
	}else if(text.toLowerCase().startsWith("@auto")){
		a = text.split("@auto");
		if(!auto){
			auto = [];
		}
		if(auto){
			for(i in auto){
				if(auto[i].id == id){
					auto.splice(i,1);
				}
			}
		}
		auto.push({"id":id , "msg" : a[1]});
		UI.log("automatic msg set to " + a[1]);
		inputBar.clearValue();
	}else if(text.toLowerCase().startsWith("@schedule")){
		b = text.split(" ");
		date = b[1].split("/");
		time = b[2].split(":");

		date[0] = parseInt(date[0]);	
		date[1] = parseInt(date[1]);	
		date[2] = parseInt(date[2]);	

		time[0] = parseInt(time[0]);
		time[1] = parseInt(time[1]);

		today = new Date();
		myd = new Date(date[2], date[1] - 1, date[0], time[0], time[1]);
		diff = myd - today;
		if(diff < 0){
			inputBar.clearValue();
			UI.log("Time schedule is of past. Please reschedule it.(This message is only visible to you.)");
		}else{
			myText = (b.splice(3)).join(" ");
			ScheduleMessage(api, id, myText, diff);
			inputBar.clearValue();
			UI.log("Message Scheduled Successfully.(This message is only visible to you.)");			
		}
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

function ScheduleMessage(api, id, text, time){
	setTimeout(function(){
		api.sendMessage(text, id);
		UI.log("You: "+text);		
	}, time);
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

module.exports = {
	'download': download,
	'unreadThreads':unreadThreads,
}