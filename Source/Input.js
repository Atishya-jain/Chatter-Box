/*
	This API contains various functions to take input from the user and pass them back
	in the form required by the caller.
*/
const readline = require("readline-sync")

function GetCredentials(){
	email = readline.question("Email: ");
	password = readline.question("password: ",{
		hideEchoBack: true,
		mask: '*'
	});
	 
	return {email: email, password: password};
}

module.exports = {
	'GetCredentials': GetCredentials
}