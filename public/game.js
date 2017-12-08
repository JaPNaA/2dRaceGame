class Game { // Game class
    constructor(p, e) {
        var that = this;
        this.screen = p;
        this.level = e;
        this.map = [];
        this.entities = [];
        this.ready = false;
        getMap(e).then(e => { // async function getMap
            that.map = e;
            that.start();
        });
        this.cameraX = 0;
        this.cameraVX = 0;
        this.cameraY = 0;
        this.cameraVY = 0;
        this.cameraFocus = null;
        this.freeCam = false;
        this.eventListeners = {
            load: []
        };
    }
    addEventListener(e, f){
        var a = this.eventListeners[e];
        if(!a) return;
        a.push(f);
    }
    dispatchEvent(e){
        var a = this.eventListeners[e];
        if(!a) return;
        for(let i of a){
            i(this);
        }
    }
    start() {
        this.ready = true;
        this.dispatchEvent("load");
    }
    draw(X) {
        if (!this.ready) {
            X.sFill("#000");
            X.uText("Loading...", 0, 0, "#888", "2px Arial", 1);
            return;
        }
        this.freeCam = this.screen.C.key[9];
        this.background(X);
        for (let i of this.entities) {
            i.draw(X, this.cameraX, this.cameraY);
        }
        for (let y = 0; y < this.map.length; y++) {
            let a = this.map[y],
                al = this.map[y].length;
            for (let x = 0; x < al; x++) {
                if (a[x] == 0) continue;
                this.drawBlock(X, x, y, a[x]);
            }
        }
    }
    tick(tt) {
        if(!this.ready) return;
        if (this.cameraFocus && !this.freeCam) {
            let f = this.cameraFocus,
                s = 15;
            this.cameraX += (f.x - this.cameraX) / s;
            this.cameraY += (f.y - this.cameraY) / s;
        } else {
            {
                let k = this.screen.C.key,
                    s = 100 * tt;
                if (k[87] || k[38]) {
                    // up
                    this.cameraVY += -s;
                }
                if (k[65] || k[37]) {
                    // left
                    this.cameraVX += -s;
                }
                if (k[83] || k[40]) {
                    // down
                    this.cameraVY += s;
                }
                if (k[68] || k[39]) {
                    // right
                    this.cameraVX += s;
                }
            }

            this.cameraX += this.cameraVX * tt;
            this.cameraY += this.cameraVY * tt;
            this.cameraVX *= 0.995 ** (tt * 1e3);
            this.cameraVY *= 0.995 ** (tt * 1e3);
        }
        for (let i of this.entities) {
            i.tick(tt);
        }
    }
    drawBlock(X, x, y, d) {
        X.uBlock(x - this.cameraX, y - this.cameraY, BLOCKINDEX[d].fill);
    }
    background(X) {
        X.sFill("#5ab3ff");
    }
    addPlayer(e) {
        var p = new Player(this);
        if (e) {
            this.cameraFocus = p;
        }
        this.entities.push(p);
    }
    block(t, o) {
        // 0: below, 1: left, 2: right, 3: above
        var x1 = Math.floor(o.x),
            x2 = Math.ceil(o.x + o.width),
            y1 = Math.floor(o.y),
            y2 = Math.floor(o.y + o.height),
            ns = BLOCKINDEX.NONSOLID;

        if (t == 0) {
            if (!this.map[y2]) return false;
            for (let i = x1; i < x2; i++) {
                if (!ns.includes(this.map[y2][i])) {
                    return [i, y2];
                }
            }
            return false;
        }
        if (t == 1) {
            for (let i = y1; i < y2; i++) {
                if (!this.map[i]) continue;
                if (!ns.includes(this.map[i][x1])) {
                    return [x1, i];
                }
            }
            return false;
        }
        if (t == 2) {
            x2--;
            for (let i = y1; i < y2; i++) {
                if (!this.map[i]) continue;
                if (!ns.includes(this.map[i][x2])) {
                    return [x2, i];
                }
            }
            return false;
        }
        if (t == 3) {
            if (!this.map[y1]) return false;
            for (let i = x1; i < x2; i++) {
                if (!ns.includes(this.map[y1][i])) {
                    return [i, y1];
                }
            }
            return false;
        }
    }
}
