console.log("\nNode version: " + process.version);

const http = require("http"),
    fs = require("fs"),
    websocket = require("websocket"),
    os = require("os"),
    openBrowser = require("open"),
    readLine = require("readline");

var port = process.env.PORT || 80,
    server = http.createServer(function(q, r) {
        try {
            var url = q.url,
                odt = false,
                mime;
            {
                if (url.length <= 1) {
                    url = "/index.html";
                }
                if (url.toLowerCase() == "/leveleditor") {
                    url = "/levelEditor/index.html";
                }
                url = "public" + url;
            }
            mime = url.split(".");
            mime = mime[mime.length - 1];
            if (["css", "js", "html", "rgm"].includes(mime)) {
                mime = "text/" + mime;
            } else if (["png", "jpg", "jpeg", "bmp"].includes(mime)) {
                mime = "img/" + mime;
            }
            fs.readFile(url, function(e, c) {
                if (e) {
                    r.writeHead(404, {
                        "content-type": "text/html"
                    });
                    fs.readFile("responsePage/404.html", function(e, c) {
                        if (e) return;
                        r.end(c);
                    });
                    return;
                }
                r.writeHead(200, {
                    "content-type": mime || "text/plain"
                });
                r.end(c);
                console.log(q.connection.remoteAddress + " -> " + url + " :" + mime + ", " + (e ? 404 : 200));
            });
        } catch (e) {
            r.writeHead(500, {
                "content-type": "text/html"
            });
            fs.readFile("responsePage/500.html", function(er, c) {
                r.end(
                    c
                        .toString()
                        .replace(
                            /\{error\}/,
                            [e.message, e.fileName, e.lineNumber].join("\n")
                        )
                );
            });
        }
    });

{
    let ni = os.networkInterfaces(),
        h = [];
    for (let i in ni) {
        for (let j of ni[i]) {
            if (j.family == "IPv4") {
                h.push(j.address);
            }
        }
    }
    console.log("connect via: \n  " + h.join("\n  "));
}

function questionOpenBrowser(e) {
    var rl = readLine.createInterface({
            input: process.stdin,
            output: process.stdout
        }),
        sI = setTimeout(function() {
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

server.listen(port, () => {
    let p = server.address().port;
    console.log("hosting on port " + p);
    questionOpenBrowser("http://localhost:" + p);
});

port = 1024;
server.on("error", function() {
    console.log("failed to host on port " + (port - 1));
    console.log("searching for open ports...");
    findAlternatePorts();
});

function findAlternatePorts() {
    server.listen(port++);
}

function toFloat32Array(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return new Float32Array(ab);
}

function compileClientData(e) {
    var a = [];

    for(let i of CLIENTS) {
        if (i === e || !i.last) continue;
        for(let j of i.last) {
            a.push(j);
        }
    }

    return a.join(",");
}


const WSServer = new websocket.server({
    httpServer: server
}),
      CLIENTS = [];
var currId = 1;

WSServer.on("request", function (r) {
    var C = r.accept(null, r.origin),
        IX = currId++;
    CLIENTS.push(C);

    console.log("WebSocket connect, clients connected:", CLIENTS.length);

    C.send("id:" + IX);
    C.on("message", function (m) {
        if (m.type != "binary") return;
        let a = toFloat32Array(m.binaryData), r;
        C.last = a;
        r = compileClientData(C);
        if(r) C.send(r);
    });
    C.on("close", function (m) {
        CLIENTS.splice(CLIENTS.indexOf(C), 1);
        console.log("WebSocket disconnect, clients connected:", CLIENTS.length);
        for(let i of CLIENTS) {
            i.send("rem:" + IX);
        }
    });
});