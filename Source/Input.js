/*
	This API contains various functions to take input from the user and pass them back
	in the form required by the caller.
*/
const readline = require("readline-sync")
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


function getName(data1, data2){
	name = readline.question("Enter name of the person/Group you want to chat with: ");
    id1 = searchStringInArray(name, data1, true);
    id2 = searchStringInArray(name, data2, false);
    if((id1.length == 0) && (id2.length == 0)){
    	console.log("You entered the wrong name.");
    	return getName(data1, data2);
    }else{
    	return [id1, id2];
    }
}

// Function to match name entered with a list of names.
function searchStringInArray (str, strArray, isFriendList) {
	nameList = [];
	for (var j=0; j<strArray.length; j++) {
	    if(!isFriendList){
	    	if((strArray[j].name !== null) && (str !== null)){
	    		if((str.length != 0) && (strArray[j].name != 0)){
	    			if (strArray[j].name.toLowerCase().match(str.toLowerCase())) nameList.push(j);
	    		}
	    	}
    	}else{
	    	if((strArray[j].fullName !== null) && (str !== null)){
	    		if((str.length != 0) && (strArray[j].fullName != 0)){
	    			if (strArray[j].fullName.toLowerCase().match(str.toLowerCase())) nameList.push(j);
	    		}
	    	}    		
    	}
    }
    return nameList;
}

// Function to get a unique chat from user if there are multiple users matching the name entered
function GetSingleOption(id, data1, data2){
	dummy1 = []
	dummy2 = []
	for(var i = 0; i< id[0].length; i++){
		dummy1.push(data1[id[0][i]]);
		console.log((i+1) + " " + data1[id[0][i]].fullName);
	}
	for(var i = 0; i< id[1].length; i++){
		dummy2.push(data2[id[1][i]]);
		console.log((i+1+id[0].length) + " " + data2[id[1][i]].name);
	}
	pos = readline.question("Enter S.No. of the person/Group you want to chat with: ");

	if((pos > 0) && (pos < (id[0].length + 1 + id[1].length))){
		if(pos <= id[0].length){
			return [dummy1[pos-1].userID, dummy1[pos-1].fullName, false];
		}else{
			return [dummy2[pos-1-id[0].length].threadID, dummy2[pos-1-id[0].length].name, true];
		}	
	}else{
		console.log("Wrong option. Please try again.");
		return GetSingleOption(id, data1, data2);
	}	
}

module.exports = {
	'GetCredentials': GetCredentials,
	'GetSingleOption': GetSingleOption,
	'getName':getName
}