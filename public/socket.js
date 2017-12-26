class Socket {
    constructor(s) {
        var that = this;
        this.websocket = new WebSocket(s);
        this.events = {
            open: [],
            close: [],
            message: []
        };
        this.throttle = 50;
        this.then = Date.now();
        this.splitL = null;
        this.game = null;

        function handleEvent(e) {
            if (!that.events[e.type]) return;
            for (let i of that.events[e.type]) {
                i(e);
            }
        }

        for (let i in this.events) {
            this.websocket.addEventListener(i, handleEvent);
        }
        this.websocket.addEventListener("message", e => that.parseMessage(e.data));
        this.id = null;
    }
    parseMessage(e) {
        if (!this.id && e.startsWith("id:")) {
            this.id = parseInt(e.substring(3, e.length));
            return;
        } else if (e.startsWith("rem:")) {
            let g = this.game.entities,
                a = parseInt(e.substring(4, e.length)),
                b = g.find(e => e.id == a);
            if (b) {
                g.splice(g.indexOf(b), 1);
            }
            return;
        }

        var a = JSON.parse("[" + e + "]"),
            r = [];
        if(!this.splitL) return; //* change splitL to fix value
        for (let i = 0; i < a.length; i += this.splitL) {
            r.push(a.splice(i, i + this.splitL));
        }
        if (this.game) {
            for (let i of r) {
                let q = this.game.entities.find(e => i[0] == e.id);
                if (!q) {
                    this.game.addPlayer().id = i[0];
                    continue;
                }
                if (q.control != 2) return;
                q.x = i[1];
                q.y = i[2];
                q.vx = i[3];
                q.vy = i[4];
                q.facing = i[5];
            }
        }
    }
    on(e, c) {
        this.events[e].push(c);
    }
    addControl(e) {
        e.control = 2;
    }
    removeControl(e) {
        e.control = 0;
    }
    setSendPlayer(e) {
        e.socket = this;
    }
    removeSendPlayer(e) {
        e.socket = null;
    }
    send(e) {
        if (SOCKET.websocket.readyState != 1) return;
        var n = Date.now();
        if (this.then + this.throttle < n) {
            var s = [this.id, e.x, e.y, e.vx, e.vy, e.facing ? 1: 0],
                f = new Float32Array(s);
            if(!this.splitL) this.splitL = s.length;
            this.websocket.send(f);
            this.then += this.throttle;
        }
    }
    bindGame(e) {
        this.game = e;
    }
}