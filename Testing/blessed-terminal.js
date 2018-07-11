const blessed  = require("blessed")
const XTerm    = require("blessed-xterm")

const screen = blessed.screen({
    title:       "sample",
    smartCSR:    true,
    autoPadding: false,
    warnings:    false
})



var opts = {
    shell:         process.env.SHELL || "sh",
    args:          [],
    env:           process.env,
    cwd:           process.cwd(),
    cursorType:    "block",
    border:        "line",
    scrollback:    1000,
    style: {
        fg:        "default",
        bg:        "default",
        border:    { fg: "default" },
        focus:     { border: { fg: "green" } },
        scrolling: { border: { fg: "red" } }
    }
}

var body = new XTerm(Object.assign({}, opts, {
    left:    0,
    top:     0,
    width:   Math.floor(screen.width / 2),
    height:  screen.height,
    label:   "Sample XTerm #1"
}))

let hint = "\r\nPress CTRL+q to stop sample program.\r\n" +
    "😊\r\n\r\n"
body.write(hint)


const terminate = () => {
    screen.destroy()
    process.exit(0)
}

screen.key([ "C-q" ], (ch, key) => {
    terminate()
})

screen.append(body);
screen.render()

