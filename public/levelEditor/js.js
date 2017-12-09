const CVS = document.getElementById("cvs"),
    X = CVS.getContext("2d"),
    C = {
        key: []
    };
window.scale = 28;
getTr(1);

IMG.plusArrow = loadImage("plusArrow.png");

class Main {
    constructor(e) {
        var that = this;
        this.level = e;
        this.map = [];
        this.entities = [];
        this.ready = false;
        getMap(e).then(e => {
            // async function getMap
            that.map = e;
            that.start();
        });
        this.cameraX = 0;
        this.cameraVX = 0;
        this.cameraY = 0;
        this.cameraVY = 0;
        this.cameraFocus = null;
        this.freeCam = true;
        this.eventListeners = {
            load: []
        };
        this.then = Date.now();
        this.reqanf();
        this.tickl();
    }
    draw() {
        if (!this.ready) {
            X.sFill("#000");
            X.uText("Loading...", 0, 0, "#888", "2px Arial", 1);
            return;
        }
        this.freeCam = C.key[9];
        this.background(X);
        for (let i of this.entities) {
            i.draw(X, this.cameraX, this.cameraY);
        }
        for (
            let y = Math.floor(this.cameraY - innerHeight / scale / 2);
            y < this.cameraY + innerHeight / scale / 2;
            y++
        ) {
            for (
                let x = Math.floor(this.cameraX - innerWidth / scale / 2);
                x < this.cameraX + innerWidth / scale / 2;
                x++
            ) {
                let a = this.map.getBlock(x, y);
                this.drawBlock(x, y, a);
            }
        }
    }
    drawBlock(x, y, d) {
        if (!BLOCKINDEX[d]) return;
        X.uBlock(
            x - this.cameraX,
            y - this.cameraY,
            BLOCKINDEX[d].fill,
            null,
            null,
            null,
            null,
            {
                outline: true
            }
        );
    }
    background() {
        X.sFill("#000");
        X.uRect(
            -this.cameraX,
            -this.cameraY,
            this.map.width,
            this.map.height,
            "#5ab3ff"
        );
    }
    tick(tt) {
        if (!this.ready) return;
        if (this.cameraFocus && !this.freeCam) {
            let f = this.cameraFocus,
                s = 20;
            this.cameraX += (f.x - this.cameraX) / s;
            this.cameraY += (f.y - this.cameraY) / s;
        } else {
            {
                let k = C.key,
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
    reqanf() {
        if (!this.active) return;
        var that = this;
        requestAnimationFrame(function() {
            that.draw();
            that.reqanf();
        });
    }
    start() {
        this.ready = true;
        this.active = true;
        this.reqanf();
        for (let i in this.events) {
            addEventListener(i, this.eventHandler, false);
        }
        if (this.tickLoop) {
            var t = this;
            this.sI = setInterval(() => this.tick(t), 1);
        }
        return this;
    }
    tickl() {
        var that = this;
        setInterval(function() {
            var n = Date.now();
            that.tick((n - that.then) / 1e3);
            that.then = n;
        }, 1);
    }
    click(x, y) {
        var nx = x / scale + this.cameraX,
            ny = y / scale + this.cameraY;
        this.map.setBlock(Math.floor(nx), Math.floor(ny), 1);
    }
}

addEventListener("keydown", e => (C.key[e.keyCode] = true));
addEventListener("keyup", e => (C.key[e.keyCode] = false));
function resize() {
    CVS.width = innerWidth;
    CVS.height = innerHeight;
}
resize();
addEventListener("resize", resize);
addEventListener("wheel", function(e) {
    if (e.deltaY > 0) {
        if (!(scale < 4)) {
            scale -= 2;
        }
    } else {
        scale += 2;
    }
    getTr(1);
});
addEventListener("click", function(e) {
    main.click(e.clientX - innerWidth / 2, e.clientY - innerHeight / 2);
});

var main = new Main(prompt("Load level... (int)"));
