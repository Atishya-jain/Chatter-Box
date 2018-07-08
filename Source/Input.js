/*
	This API contains various functions to take input from the user and pass them back
	in the form required by the caller.
*/
const readline = require("readline-sync")

//const interact = require('./Interact');

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

//function ask(err, api){
//	interact.unreadThreads(api, getName);	
	// console.log("Hi There What do you want to do .... \n 1)Chat With a friend \n2)Send A New Message\n3)See UnreadThreads")	
	// ans = readline.question("Option: ");
	// if(ans == "1"){
	// 	interact.listen(api);
 //    }else if(ans == "2"){
 //    	interact.sendmessage(err,api,ask);
 //    }else{
 //    	interact.unreadThreads(api);
 //    }
//}

function getName(data){
	name = readline.question("Enter name of the person you want to chat with: ");
    id = searchStringInArray(name, data);
    if(id == -1){
    	console.log("You entered the wrong name.");
    	return getName(data);
    }else{
    	return id;
    }
}

// Function to match name entered with a list of names.
// ToDo: Change this to regex matching
function searchStringInArray (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].fullName.toLowerCase().match(str.toLowerCase())) return j;
    }
    return -1;
}

module.exports = {
	'GetCredentials': GetCredentials,
//	'ask': ask,
	'getName':getName
}