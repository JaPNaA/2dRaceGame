const ws = require("websocket");

function toFloat32Array(b) {
    var a = new ArrayBuffer(b.length);
    var c = new Uint8Array(a);
    for (var i = 0; i < b.length; ++i) {
        c[i] = b[i];
    }
    return new Float32Array(a);
}

class Socket {
    constructor(s) {
        var that = this;

        this.websocket = new ws.server({
            httpServer: s
        });
        this.clients = [];
        this.currId = 0;

        this.websocket.on("request", e => that.onRequest(e));
        setInterval(() => that.tickMessage(), 50);
    }
    onRequest(r) {
        var C = r.accept(null, r.origin),
            that = this;
        this.clients.push(C);

        console.log("Clients connected:", this.clients.length + 1);

        C.id = this.currId++;

        C.send("id:" + C.id);

        C.on("message", e => that.onMessage(e, C));
        C.on("close", function (m) {
            that.clients.splice(that.clients.indexOf(C), 1);
            for (let i of that.clients) {
                i.send("rem:" + C.id); // send removal of player
            }
            console.log("Clients connected:", that.clients.length);
        });
    }
    onMessage(m, C) {
        if (m.type != "binary") return;
        let a = toFloat32Array(m.binaryData);
        C.last = a;
    }
    compileClientData(C) {
        var f = [];
        for (let i of this.clients) {
            if (!i.last || i == C) continue;
            for (let j of i.last) {
                f.push(j);
            }
        }
        return f.join(',');
    }
    tickMessage() {
        for (let C of this.clients) {
            var r = this.compileClientData(C);
            if (r) C.send(r);
        }
    }
}

module.exports = {
    Socket: Socket
};