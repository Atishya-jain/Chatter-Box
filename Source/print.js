/*
	This file contains various functions to print on terminal depending on different screens
	This should be a stand-alone API
*/
const fs = require("fs");

function SaveSession(api){
	fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
}

function PrintChoice(api, unreadPresent){
	if(!unreadPresent){
		return console.log("There are no unread messages.");
	}else{
		return console.log("Above are the unread messages.");
	}
}

module.exports  = {
	'SaveSession':SaveSession,
	'PrintChoice':PrintChoice
}