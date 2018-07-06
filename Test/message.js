const fs = require("fs");
const readline = require('readline-sync')
const login = require("facebook-chat-api");

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
	console.log("Hi There What do you want to do .... \n 1)Listen For Messages \n2)Send A New Message")	
			ans = readline.question("Option: ");
			

			if(ans == "1"){
				listen();
		    }else{
		    	sendmessage();
		    } 
}

// listens for the messages on messenger 
function listen(){
    api.listen((err, message) => {
    	
		
		// get the username by using senderID that we received from the message
    	api.getUserInfo(message.senderID,function(err,ret){
			for(var prop in ret) {
	            if(ret.hasOwnProperty(prop)) {
	                console.log(ret[prop].name + " : " + message.body);
	            }
        	}
			

    	});
    });
}



//sends messages
function sendmessage(){
	login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
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
		

	});

}

