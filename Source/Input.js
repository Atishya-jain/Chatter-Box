/*
	This API contains various functions to take input from the user and pass them back
	in the form required by the caller.
*/
const readline = require("readline-sync")
const interact = require('./Interact');
const fs = require("fs");

// Function to get credentials of the user.
// ToDo: Implement functionality to detect escape character and again prompt back to enter password.
// Escape character signifies that password entered was by mistake
function GetCredentials(){
	email = readline.question("Email: ");
	password = readline.question("Password: ",{
		hideEchoBack: true,
		mask: '*'
	});
	 
	return {email: email, password: password};
}


function ask(err, api){
	console.log("Hi There What do you want to do .... \n 1)Listen For Messages \n2)Send A New Message\n3)Send Image")	
	ans = readline.question("Option: ");
	if(ans == "1"){
		interact.listen(api);
    }else{
    	interact.sendmessage(err,api, ask);
    } 
}

module.exports = {
	'GetCredentials': GetCredentials,
	'ask': ask
}