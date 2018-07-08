const blessed = require('blessed');

var screen;
var body;
var inputBar;
var notification;

function createWindows(){
	screen = blessed.screen({
	  smartCSR: true
	});
	notification = blessed.box({
		top: 0,
	  	left: 0,
	  	height: 1,
	  	width: '100%',
	  	keys: true,
	  	mouse: true,
	  	alwaysScroll: true,
	  	scrollable: true,
	  	scrollbar: {
	    	ch: ' ',
	    	bg: 'red'
	  	},
	  	style: {
	   	 	fg: 'white',
	    	bg: 'black'  // Blue background so you see this is different from body
	  	}
	});
	body = blessed.box({
	  top: 1,
	  left: 0,
	  height: '100%-2',
	  width: '100%',
	  keys: true,
	  mouse: true,
	  alwaysScroll: true,
	  scrollable: true,
	  scrollbar: {
	    ch: ' ',
	    bg: 'red'
	  }
	  
	});
	inputBar = blessed.textbox({
	  bottom: 0,
	  left: 0,
	  height: 1,
	  width: '100%',
	  keys: true,
	  mouse: true,
	  focused: true,
	  inputOnFocus: true,
	  style: {
	    fg: 'white',
	    bg: 'blue'  // Blue background so you see this is different from body
	  }
	});

	// Add body to blessed screen
	screen.append(body);
	screen.append(inputBar);
	screen.append(notification);

	// Close the example on Escape, Q, or Ctrl+C
	screen.key(['escape', 'q', 'C-c'], (ch, key) => (process.exit(0)));
	inputBar.key(['escape', 'C-c'], (ch, key) => (process.exit(0)));
}

function log(text) {
  body.pushLine(text);
  screen.render();
}

function lognotification(text){
	notification.content = text;		
	screen.render();
}

function getbody(){
	return body;
}

function getinputBar(){
	return inputBar;
}

function getscreen(){
	return screen;
}

function getnotification(){
	return notification;
}
module.exports = {
	'log':log,
	'lognotification':lognotification,
	'createWindows':createWindows,
	'getnotification': getnotification,
	'getscreen':getscreen,
	'getbody':getbody,
	'getinputBar':getinputBar
}