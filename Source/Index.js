/*
	This file contains the control flow of our app.
	It only contains various API calls both user defined and Node_Modules
	Like this API is meant only for using conditionals and call other APIs
	For eg:
	if(str == "@img"){
		input.InputImage();
	}
	and various other calls put together.
*/

const fs = require("fs");
const readline = require("readline-sync")
const login = require("facebook-chat-api");
const shell = require("shelljs");
const request = require("request");
const Interact = require("./Interact");
const Input = require("./Input");
const Output = require("./print");
const UI = require("./window");

console.log("\033c");
FBLogin();

function FBLogin(){
	// Checking is appstate session is active
	if(!fs.existsSync('appstate.json')){
		console.log("Please enter your Facebook credentials...")
		//Asking for facebook credentials
		var credentials = Input.GetCredentials(); 
		start(credentials, true);
	}else{
		var credentials = {appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))};
		start(credentials, false);
	}
}

// login in using the credentials
function start(credentials, savesession){
	login(credentials, (err, api) => {
		api.setOptions({
	    		logLevel: "silent"
			});
	    if(err) return FBLogin();
		
		if(!savesession){
			
		}else{
			Output.SaveSession(api);
		}
//		ans = '';
//		Input.ask(err, api);
		var choice;
		choice = readline.question("1)Display Unread Threads and choose friend\n2)Choose Group\n->");
		if(choice == 1){
			Interact.unreadThreads(api);	
		}else{
			Interact.displaygroups(api);	
		}
		
		

	});
}