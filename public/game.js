class Game {
    // Game class
    constructor(p, e) {
        var that = this;
        this.screen = p;
        this.level = e;
        this.entities = [];
        this.ready = false;
        this.map = new Map(e).then(() => {
            // async function getMap
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
    addEventListener(e, f) {
        var a = this.eventListeners[e];
        if (!a) return;
        a.push(f);
    }
    dispatchEvent(e) {
        var a = this.eventListeners[e];
        if (!a) return;
        for (let i of a) {
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

        let cf = this.cameraFocus,
            ofx = (cf && -cf.width) || 0,
            ofy = (cf && -cf.height) || 0;

        for (let i = this.map.layers - 1; i >= 0; i--) {
            let ss = Math.ceil(this.screen.scale / 2);
            for (
                let y = Math.floor(this.cameraY + ofy) - ss;
                y < this.cameraY - ofy + ss;
                y++
            ) {
                let al = this.map.width;
                for (
                    let x = Math.floor(this.cameraX + ofx) - ss;
                    x < this.cameraX - ofx + ss;
                    x++
                ) {
                    // let a = this.map.getBlock(x, y);
                    // if (!a) continue;
                    // this.drawBlock(X, x, y, a);
                    let a = this.map.getBlock(x, y, i);
                    if (a == 0) continue;
                    this.drawBlock(X, x, y, a, i);
                }
            }
        }
        for (let i of this.entities) {
            i.draw(X, this.cameraX, this.cameraY);
        }
    }
    tick(tt) {
        if (!this.ready) return;
        if (this.cameraFocus && !this.freeCam) {
            let f = this.cameraFocus,
                s = 15;
            this.cameraX += (f.x - this.cameraX) / s;
            this.cameraY += (f.y - this.cameraY) / s;
        } else {
            {
                let k = this.screen.C.key,
                    s = 100 * tt;
                if (k[87] || k[38] || k[32]) {
                    // up
                    this.cameraVY += -s;
                }
                if (k[65] || k[37]) {
                    // left
                    this.cameraVX += -s;
                }
                if (k[83] || k[40] || k[16]) {
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
    drawBlock(X, x, y, d, z) {
        // X.uBlock(x - this.cameraX, y - this.cameraY, BLOCKINDEX[d].fill);
        // if (!BLOCKINDEX[d.id]) return;
        // var lum = 0, f;
        //
        // if(typeof BLOCKINDEX[d.id].fill == "function"){
        //     f = BLOCKINDEX[d.id].fill(d);
        // } else {
        //     f = BLOCKINDEX[d.id].fill;
        // }
        //
        // if (z == 2) {
        //     lum = -0.3;
        // } else if (z == 1) {
        //     lum = 0.1;
        // }
        //
        // X.uBlock(
        //     x - this.cameraX,
        //     y - this.cameraY,
        //     f,
        //     null,
        //     null,
        //     null,
        //     null,
        //     {
        //         lum: lum
        //     }
        // );
        if (!d || !BLOCKINDEX[d.id] || d.id == 0) return;
        var lum = 0,
            f;

        if (typeof BLOCKINDEX[d.id].fill == "function") {
            f = BLOCKINDEX[d.id].fill(d);
        } else {
            f = BLOCKINDEX[d.id].fill;
        }

        if (z == 2) {
            lum = -0.3;
        } else if (z == 1) {
            lum = 0.1;
        }
        X.uBlock(
            x - this.cameraX,
            y - this.cameraY,
            f,
            null,
            null,
            null,
            null,
            {
                lum: lum
            }
        );
    }
    background(X) {
        X.sFill("#5ab3ff");
    }
    addPlayer(e) {
        var p = new Player(this);
        if (e) {
            this.cameraFocus = p;
            getTr(1, this.screen.scale, -p.width / 2, -p.height / 2);
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
            for (let i = x1; i < x2; i++) {
                let m = this.map.getBlock(i, y2, 0);
                if (!m) continue;
                if (!ns.includes(m.id)) {
                    return [i, y2];
                }
            }
            return false;
        }
        if (t == 1) {
            for (let i = y1; i < y2; i++) {
                let m = this.map.getBlock(x1, i, 0);
                if (!m) continue;
                if (!ns.includes(m.id)) {
                    return [x1, i];
                }
            }
            return false;
        }
        if (t == 2) {
            x2--;
            for (let i = y1; i < y2; i++) {
                let m = this.map.getBlock(x2, i, 0);
                if (!m) continue;
                if (!ns.includes(m.id)) {
                    return [x2, i];
                }
            }
            return false;
        }
        if (t == 3) {
            for (let i = x1; i < x2; i++) {
                let m = this.map.getBlock(i, y1, 0);
                if (!m) continue;
                if (!ns.includes(m.id)) {
                    return [i, y1];
                }
            }
            return false;
        }
    }
}
