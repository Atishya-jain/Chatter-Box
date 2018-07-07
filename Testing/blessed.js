const blessed = require('blessed');

var screen = blessed.screen();
var body = blessed.box({
  top: 0,
  left: 0,
  height: '100%-1',
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
var inputBar = blessed.textbox({
  bottom: 0,
  left: 0,
  height: 1,
  width: '100%',
  keys: true,
  mouse: true,
  inputOnFocus: true,
  style: {
    fg: 'white',
    bg: 'blue'  // Blue background so you see this is different from body
  }
});

// Add body to blessed screen
screen.append(body);
screen.append(inputBar);

// Close the example on Escape, Q, or Ctrl+C
screen.key(['escape', 'q', 'C-c'], (ch, key) => (process.exit(0)));

// Handle submitting data
inputBar.on('submit', (text) => {
  log(text);
  inputBar.clearValue();
});

// Add text to body (replacement for console.log)
function log(text) {
  body.pushLine(text);
  screen.render();
}


/*
 * Demonstration purposes
 */

// Listen for enter key and focus input then
screen.key('enter', (ch, key) => {
  inputBar.focus();
});

// Log example output
setInterval(() => {
  log("just displaying some stuff");
}, 1000);