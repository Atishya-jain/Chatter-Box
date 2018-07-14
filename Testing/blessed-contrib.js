   var blessed = require('blessed')
     , contrib = require('blessed-contrib')
     , screen = blessed.screen()
     , grid = new contrib.grid({rows: 1, cols: 2, screen: screen})
 
   // var line = grid.set(0, 0, 1, 1, contrib.line,
   //   { style:
   //     { line: "yellow"
   //     , text: "green"
   //     , baseline: "black"}
   //   , xLabelPadding: 3
   //   , xPadding: 5
   //   , label: 'Stocks'})
 
   var log = contrib.log(
      { 
        top: 5,
        fg: "green"
      , selectedFg: "green"
      , label: 'Server Log'})
   log.log("😊")
   screen.append(log);
 
   var lineData = {
      x: ['t1', 't2', 't3', 't4'],
      y: [5, 1, 7, 5]
   }
 
   // line.setData([lineData])
 
   screen.key(['escape', 'q', 'C-c'], function(ch, key) {
     return process.exit(0);
   });
 
   screen.render()