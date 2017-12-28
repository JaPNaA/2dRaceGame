console.log("\nNode version: " + process.version);

var readLine = require("readline"),
    openBrowser = require("open");
/*
    require("./server/socket.js");
        Sets up websocket:
            - create sending interface
            - get all clients data
            - automated sending packages (at requested speeds)
            - suports mutiple "rooms"
    require("./server/physics.js");
        Does physics:
            - takes clients data and moves them
    require("./server/map.js");
        Send map data:
            - According to room
    require("./server/server.js");
        hosts server:
            - 
*/

var Socket = require("./server/socket.js").Socket,
    Server = require("./server/server.js").Server;

var server = new Server();
server.listen();

new Socket(server, 50);

function questionOpenBrowser(e) {
    var rl = readLine.createInterface({
            input: process.stdin,
            output: process.stdout
        }),
        sI = setTimeout(function () {
            rl.close();
            console.log("okey, no open browser");
        }, 5000);

    rl.question("Open browser?(Y/n) \n> ", a => {
        clearTimeout(sI);
        if (a && a[0].toLowerCase() == "y") {
            openBrowser(e);
        }
        rl.close();
    });
    rl.on("close", () => console.log("^C"));
}