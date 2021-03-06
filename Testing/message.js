const fs = require("fs");
const readline = require('readline-sync')
const login = require("facebook-chat-api");
const shell = require("shelljs");
const request = require("request");
require('shelljs-plugin-open');

// clear screen
console.log("\033c");

console.log("Welcome to Chatter-Box.........");
console.log("This is a test app that will connect to your messenger account and receive your messages and display in the terminal and you can also send messages to your friends")




//Checking Whether the user is loging in for the first time..
if(!fs.existsSync('appstate.json')){
	console.log("Please enter your Facebook credentials...")
	//Asking for facebook credentials
	email = readline.question("Email: ");
	password = readline.question("password: ");
	 
	var credentials = {email: email, password: password};
	 
	
	//loging into facebook and saving the session in appstate.json
	login(credentials, (err, api) => {
	    if(err) return console.error(err);
	 
	    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
	    start();
	});	
}else{
	start();
}

function start(){
// loging in using the credentials saved in appstate.json
	login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
	    if(err) return console.error(err);
		api.setOptions({
	    	logLevel: "silent"
		});
		
		ans = '';
		
		ask();  
    	

	});

}


function ask(){
	console.log("Hi There What do you want to do .... \n1)Listen For Messages \n2)Send A New Message \n3) Send a Image")	
	ans = readline.question("Option: ");
	login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {

		if(ans == "1"){
			listen(api);
	    }else if(ans == '2'){
	    	sendmessage(err,api);
	    }else{
	    	sendimage(err,api);
	    }
	});
}

// listens for the messages on messenger 
function listen(api){
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
										shell.open(dir + "/" + message.attachments[attachment].name);
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
function sendmessage(err, api){
	
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
    	    // console.log(data[id-1]);
    	    api.sendMessage(message, data[id-1].userID,function(){
    	    	ask();
    	    });

	    });
}

//sends doc
function sendimage(err, api){
	
	api.getFriendsList((err, data) => {
	    if(err) return console.error(err);
	    i = 1;
	    for(var person in data){
	    	console.log(i + " " + data[person].firstName);
	    	i++;
	    }
	    console.log("Enter an the id of the person you want to message: ");
	    id = readline.question(">> ");
	    console.log("copy past the doc in the folder opened ");
	    shell.mkdir('-p' , './sent');
	    shell.open("sent");
	    readline.question(">> (Press enter when done)");
    	
	    files = shell.ls('sent');
    	messages = [];
	    for(var file = 0 ; file < files.length ; file++)
	    {
    		
	    	var message = {
		    	body: "",
		    	// console.log(shell.ls('sent')[0]);
		    	
	        	attachment: fs.createReadStream("sent/"+shell.ls('sent')[file])
    		}	
    		messages.push(message);
	    }
	    
    	// shell.rm('-rf','sent');
	    // console.log(data[id-1]);
	    api.sendMessage(message, data[id-1].userID,function(){
	    	ask();
	    });

    });
}


var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    
    

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


