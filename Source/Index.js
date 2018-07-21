/*
	This file contains the control of various platforms.
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
		
	    if(err) return FBLogin();
		
		if(!savesession){
			api.setOptions({
	    		logLevel: "silent"
			});	
		}else{
			Output.SaveSession(api);
		}
			Interact.unreadThreads(api);	
	});
}