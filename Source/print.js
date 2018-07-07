/*
	This file contains various functions to print on terminal depending on different screens
	This should be a stand-alone API
*/
const fs = require("fs");

function SaveSession(api){
	fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
}

module.exports  = {
	'SaveSession':SaveSession
}