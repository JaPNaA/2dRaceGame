// TODO: add "test map" feature

const CVS = document.getElementById("cvs"),
    X = CVS.getContext("2d"),
    C = {
        key: [],
        mousedown: false,
        blockp: [1, 0],
        prompta: 0,
        blur: false,
        layer: 0,
        testRunning: false,
        testWindow: null,
        preventExit: false,
        fillMode: false,
        startX: 0,
        startY: 0
    };
window.scale = 28;
getTr(1);

IMG.plusArrow = loadImage("plusArrow.png");

class Main {
    constructor(e) {
        var that = this;
        this.level = e;
        this.entities = [];
        this.entities = [];
        this.ready = false;
        this.map = new Map(e).then(() => {
            // async function getMap
            that.start();
        });
        this.cameraX = innerWidth / scale / 2 - 5;
        this.cameraVX = 0;
        this.cameraY = innerHeight / scale / 2 - 5;
        this.cameraVY = 0;
        this.cameraFocus = null;
        this.freeCam = true;
        this.eventListeners = {
            load: []
        };
        this.then = Date.now();
        this.ui = document.createElement("div");
        {
            let x = this.ui;
            x.classList.add("ui");
            {
                let a = document.createElement("div");
                a.classList.add("drag");
                a.innerHTML = "Menu";
                x.drag = false;
                x.top = 8;
                x.left = 8;
                a.addEventListener("mousedown", () => (x.drag = true));
                addEventListener("mouseup", () => {
                    x.drag = false;
                });
                addEventListener("mousemove", e => {
                    if (x.drag) {
                        x.top += e.movementY;
                        x.left += e.movementX;
                    }
                    x.style.top = x.top + "px";
                    x.style.left = x.left + "px";
                });
                addEventListener("resize", () => {
                    if (x.top > innerHeight - x.clientWidth) {
                        x.top = innerHeight - 32;
                    }
                    if (x.left > innerWidth - x.clientHeight) {
                        x.left = innerWidth - 32;
                    }
                });
                x.appendChild(a);
            }
            {
                let a = document.createElement("div");
                a.classList.add("current");
                x.sel = [];
                {
                    let b = document.createElement("div");
                    b.classList.add("sel");
                    b.update = function() {
                        var f = BLOCKINDEX[C.blockp[0]].fill;
                        if (typeof f == "string") {
                            this.style.backgroundColor = f;
                            this.style.backgroundImage = "none";
                        } else {
                            this.style.backgroundColor = "rgba(0,0,0,0)";
                            this.style.backgroundImage = "url(" + f.src + ")";
                        }
                    };
                    b.update();
                    a.appendChild(b);
                    x.sel.push(b);
                }
                {
                    let b = document.createElement("div");
                    b.classList.add("sel");
                    b.update = function() {
                        var f = BLOCKINDEX[C.blockp[1]].fill;
                        if (typeof f == "string") {
                            this.style.backgroundColor = f;
                            this.style.backgroundImage = "none";
                        } else {
                            this.style.backgroundColor = "rgba(0,0,0,0)";
                            this.style.backgroundImage = "url(" + f.src + ")";
                        }
                    };
                    b.update();
                    a.appendChild(b);
                    x.sel.push(b);
                }
                x.appendChild(a);
            }
            {
                let a = document.createElement("div");
                a.classList.add("blockSel");
                for (let i in BLOCKINDEX) {
                    if (!(i * 1) && i != 0) continue;
                    let b = document.createElement("div"),
                        f = BLOCKINDEX[i].fill;
                    b.classList.add("item");
                    b.block = i;
                    if (typeof f == "string") {
                        b.style.backgroundColor = f;
                        b.style.backgroundImage = "none";
                    } else {
                        b.style.backgroundColor = "rgba(0,0,0,0)";
                        b.style.backgroundImage = "url(" + f.src + ")";
                    }
                    b.addEventListener("mouseup", function(e) {
                        if (e.button === 0) {
                            C.blockp[0] = this.block;
                            x.sel[0].update();
                        } else if (e.button === 2) {
                            C.blockp[1] = this.block;
                            x.sel[1].update();
                        }
                    });
                    a.appendChild(b);
                }
                x.appendChild(a);
            }
            {
                let a = document.createElement("div");
                a.classList.add("layers");
                x.layers = [];
                for (let i = 0; i < 3; i++) {
                    let b = document.createElement("div");
                    b.classList.add("layer");
                    b.layer = b.innerHTML = i;
                    x.layers.push(b);
                    b.addEventListener("click", function() {
                        setLayer(this.layer);
                    });
                    a.appendChild(b);
                }
                x.layers[C.layer].classList.add("sel");
                x.appendChild(a);
            }
            {
                let a = document.createElement("div");
                a.style.marginTop = "12px";
                a.classList.add("button");
                a.innerHTML = "Export";
                a.addEventListener("click", function(e) {
                    var exp = main.map.export();
                    prompta(
                        "Copy/Paste<br><textarea id=txta></textarea> <br> <div id=tstmp class='button'> Test map </div>"
                    );
                    var t = document.getElementById("txta"),
                        m = document.getElementById("tstmp");
                    t.innerHTML = exp;
                    t.addEventListener("click", function() {
                        this.select();
                    });
                    t.addEventListener("keydown", function() {
                        C.preventExit = false;
                    });
                    m.addEventListener("click", function() {
                        testMap(exp);
                    });
                });
                x.appendChild(a);
            }
            document.body.appendChild(x);
        }
        this.reqanf();
        this.tickl();
    }
    draw() {
        if (C.testRunning) return;
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
                for (let i = this.map.layers - 1; i >= 0; i--) {
                    let a = this.map.getBlock(x, y, i);
                    if (a == 0 && i != 0) continue;
                    this.drawBlock(x, y, a, i == 0, i);
                }
            }
        }
    }
    drawBlock(x, y, d, o, z) {
        if (!BLOCKINDEX[d]) return;
        var lum = 0;
        if (z == 2) {
            lum = -0.3;
        } else if (z == 1) {
            lum = 0.1;
        }
        X.uBlock(
            x - this.cameraX,
            y - this.cameraY,
            BLOCKINDEX[d].fill,
            null,
            null,
            null,
            null,
            {
                outline: o,
                lum: lum
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
        m: if (this.cameraFocus && !this.freeCam) {
            let f = this.cameraFocus,
                s = 20;
            this.cameraX += (f.x - this.cameraX) / s;
            this.cameraY += (f.y - this.cameraY) / s;
        } else {
            {
                let k = C.key,
                    s = 100 * tt;
                if (k[18]) break m;
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
        if (C.mousedown !== false) {
            this.click(
                C.mouseX - innerWidth / 2,
                C.mouseY - innerHeight / 2,
                C.mousedown
            );
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
    click(x, y, t) {
        if (t === undefined || C.prompta || C.blur) return;
        var nx = x / scale + this.cameraX,
            ny = y / scale + this.cameraY;
        if (t == 0) {
            this.map.setBlock(
                Math.floor(nx),
                Math.floor(ny),
                C.layer,
                C.blockp[0]
            );
        } else if (t == 2) {
            this.map.setBlock(
                Math.floor(nx),
                Math.floor(ny),
                C.layer,
                C.blockp[1]
            );
        }
        if (C.fillMode) {
            //* Add fill:
            /* @RoxasBTG
                Variables you'll need:
                    C.startX - Where the cursor started drag X
                    C.startY -                               Y
					C.layer -                                Z
                    x - Current position  X
                    y -                   Y

                Thing's you'll need to know
                    for(let i = [Start]; i < [End]; i++){
                        // Your code, i is the current value you're on.
                        // You can rename it to 'x' or 'y' to simplify it.
                    }
                    for(let y = 1; y < 3; y++){ // in code, Y always goes first
                        for(let x = 0; x < 2; x++){ // This goes through every point from
                                                    // (0, 1) to (2, 3)
                            // Your code
                        }
                    }
				Functions You'll need
					this.map.setBlock(x, y, z, blockNumber);
            */
			for(let y = Math.floor(C.startY / scale + this.cameraY); y < ny; y++){
				for(let x = Math.floor(C.startX / scale + this.cameraX); x < nx; x++){
					this.map.setBlock(x, y, C.layer, C.blockp[t == 2 ? 1 : 0]);
				}
			}
        }
        C.preventExit = true;
    }
}

function prompta(e) {
    var a = document.createElement("div");
    C.prompta++;
    a.classList.add("prompta");
    a.innerHTML = e;
    document.body.appendChild(a);

    a.style.left = (innerWidth - a.clientWidth) / 2 + "px";
    a.style.top = (innerHeight - a.clientHeight) / 2 + "px";

    a.close = function() {
        this.parentElement.removeChild(this);
        C.prompta--;
    };
    return a;
}
function testMap(e) {
    try {
        var win = open(
            location.origin,
            "_blank",
            "width=" +
                innerWidth +
                ", height=" +
                innerHeight +
                ", top=" +
                screenY +
                ", left=" +
                screenX
        );
    } catch (e) {
        alert("an errors occurs");
        return;
    }
    if (!win) {
        alert("Enable popups and try again...");
    }
    C.testRunning = true;
    C.testWindow = win;
    win.addEventListener("devReady", () => {
        win.DEVMODE.active = true;
        win.DEVMODE.map = e;
    });
    win.addEventListener("beforeunload", () => {
        C.testRunning = false;
        this.close();
    });
}

function setLayer(e) {
    if (!main) return;
    if (e >= 0 && e < main.map.layers) {
        C.layer = e;
        for (let i of main.ui.layers) {
            if (i.layer == C.layer) {
                i.classList.add("sel");
            } else {
                i.classList.remove("sel");
            }
        }
    }
}

addEventListener("keydown", e => {
    var k = e.keyCode;
    C.key[k] = true;
    if (k == 18) e.preventDefault();
    if (e.altKey) {
        e.preventDefault();
        if (e.shiftKey) {
            if ([87, 38, 32].includes(k)) {
                // up
                main.map.removeLine(3);
            }
            if ([65, 37].includes(k)) {
                // left
                main.map.removeLine(2);
            }
            if ([83, 40].includes(k)) {
                // down
                main.map.removeLine(0);
            }
            if ([68, 39].includes(k)) {
                // right
                main.map.removeLine(1);
            }
        } else {
            if ([87, 38, 32].includes(k)) {
                // up
                main.map.addLine(3);
            }
            if ([65, 37].includes(k)) {
                // left
                main.map.addLine(2);
            }
            if ([83, 40, 16].includes(k)) {
                // down
                main.map.addLine(0);
            }
            if ([68, 39].includes(k)) {
                // right
                main.map.addLine(1);
            }
        }
    }
    if (C.prompta && k == 27) {
        let a;
        while ((a = document.getElementsByClassName("prompta")).length) {
            a[0].close();
        }
    }
    if (k >= 49 && k <= 51) {
        setLayer(k - 49);
    }
});
addEventListener("keyup", e => (C.key[e.keyCode] = false));
function resize() {
    CVS.width = innerWidth;
    CVS.height = innerHeight;
    getTr(1);
}
resize();
addEventListener("resize", resize);
addEventListener("wheel", function(e) {
    if (C.prompta) return;
    if (e.deltaY > 0) {
        if (!(scale < 4)) {
            scale -= 2;
        }
    } else {
        scale += 2;
    }
    getTr(1);
});
CVS.addEventListener("mousedown", e => {
    C.mousedown = e.button;
    C.startX = e.clientX;
    C.startY = e.clientY;
});
CVS.addEventListener("mouseup", e => {
    C.mousedown = false;
    C.blur = false;
    main.click(e.clientX - innerWidth / 2, e.clientY - innerHeight / 2);

    C.mouseX = e.clientX;
    C.mouseY = e.clientY;
});
CVS.addEventListener("mousemove", e => {
    C.mouseX = e.clientX;
    C.mouseY = e.clientY;
});
addEventListener("contextmenu", e => e.preventDefault());
addEventListener("blur", () => (C.blur = true));
addEventListener("focus", () => {
    if (C.testRunning) {
        C.testWindow.close();
        C.testRunning = false;
    }
});
onbeforeunload = function() {
    if (C.preventExit) {
        return "Are you sure?";
    }
};

var main;
new Promise(function(res) {
    var a = prompta(
            "Enter level... (int) <br> <input type=text id=in style='width: 100%;'></input> <div id=im class=button>Or import...</div>"
        ),
        i = document.getElementById("in"),
        m = document.getElementById("im");
    i.focus();
    i.addEventListener("change", function() {
        a.close();
        res(this.value);
    });
    m.addEventListener("click", function() {
        alert("Work in progress");
    });
}).then(e => {
    main = new Main(e);
});
