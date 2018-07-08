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
    if(id.length == 0){
    	console.log("You entered the wrong name.");
    	return getName(data);
    }else{
    	return id;
    }
}

// Function to match name entered with a list of names.
// ToDo: Change this to regex matching
function searchStringInArray (str, strArray) {
	nameList = [];
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].fullName.toLowerCase().match(str.toLowerCase())) nameList.push(j);
    }
    if(nameList.length == 0){
	    return -1;
    }else{
    	return nameList;
    }
}

function GetSingleOption(id, data){
	dummy = []
	for(var i = 0; i< id.length; i++){
		dummy.push(data[id[i]]);
		console.log((i+1) + " " + data[id[i]].fullName);
	}
	pos = readline.question("Enter S.No. of the person you want to chat with: ");
	if((pos > 0) && (pos < (id.length + 1))){
		return [dummy[pos-1].userID, dummy[pos-1].fullName];
	}else{
		console.log("Wrong option. Please try again.");
		return GetSingleOption(id, data);
	}	
}

module.exports = {
	'GetCredentials': GetCredentials,
	'GetSingleOption': GetSingleOption,
	'getName':getName
}