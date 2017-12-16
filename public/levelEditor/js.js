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
        startY: 0,
        data: []
    };
window.scale = 28;
getTr(1, 28);

IMG.plusArrow = loadImage("plusArrow");

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
                        var f = getBlockPreview(C.blockp[0]);
                        this.style = "";
                        if (typeof f == "string") {
                            if (f.substr(0, 4) == "css:") {
                                this.style = f.substring(4, f.length);
                            } else {
                                this.style.backgroundColor = f;
                            }
                        } else {
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
                        var f = getBlockPreview(C.blockp[1]);
                        if (typeof f == "string") {
                            if (f.substr(0, 4) == "css:") {
                                this.style = f.substring(4, f.length);
                            } else {
                                this.style.backgroundColor = f;
                            }
                        } else {
                            this.style.backgroundImage = "url(" + f.src + ")";
                        }
                    };
                    b.update();
                    a.appendChild(b);
                    x.sel.push(b);
                }
                {
                    let b = document.createElement("div");
                    b.classList.add("data");
                    b.innerHTML = "data";
                    b.addEventListener("click", function() {
                        requestDataValue();
                    });
                    a.appendChild(b);
                }
                x.appendChild(a);
            }
            {
                let a = document.createElement("div");
                a.classList.add("blockSel");
                for (let i in BLOCKINDEX) {
                    if (!(i * 1) && i != 0) continue;
                    let b = document.createElement("div"),
                        f = getBlockPreview(i);
                    b.classList.add("item");
                    b.block = i;
                    if (typeof f == "string") {
                        if (f.substr(0, 4) == "css:") {
                            b.style = f.substring(4, f.length);
                        } else {
                            b.style.backgroundColor = f;
                        }
                    } else {
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
                a.classList.add("toggle");
                a.innerHTML = "Fill Mode";
                a.addEventListener("click", function() {
                    fillModeToggle();
                });
                x.fillMode = a;
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
        if (C.fillMode && C.mousedown !== false) {
            let xn = (C.mouseX - innerWidth / 2) / scale + this.cameraX,
                yn = (C.mouseY - innerHeight / 2) / scale + this.cameraY,
                x1 = Math.floor(Math.min(xn, C.startX)),
                y1 = Math.floor(Math.min(yn, C.startY)),
                x2 = Math.ceil(Math.max(xn, C.startX)),
                y2 = Math.ceil(Math.max(yn, C.startY));
            X.sSetup();
            X.fillStyle = "rgba(255, 0, 0, 0.15)";
            X.strokeStyle = "#F00";
            X.lineWidth = 0.02;
            X.translate(-this.cameraX, -this.cameraY);
            X.rect(x1, y1, x2 - x1, y2 - y1);
            X.fill();
            X.stroke();
            X.restore();
        }
    }
    drawBlock(x, y, d, o, z) {
        if (!d || !BLOCKINDEX[d.id]) return;
        if (z != 0 && d.id == 0) return;
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
                lum: lum,
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
        m: if (this.cameraFocus && !this.freeCam) {
            let f = this.cameraFocus,
                s = 20;
            this.cameraX += (f.x - this.cameraX) / s;
            this.cameraY += (f.y - this.cameraY) / s;
        } else {
            {
                let k = C.key,
                    s = 100 * tt;
                if (k[18] || C.prompta) break m;
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
                C.blockp[0],
                C.data
            );
        } else if (t == 2) {
            this.map.setBlock(
                Math.floor(nx),
                Math.floor(ny),
                C.layer,
                C.blockp[1],
                C.data
            );
        }
        if (C.fillMode) {
            let lx = Math.min(C.startX, nx),
                ly = Math.min(C.startY, ny),
                hx = Math.ceil(Math.max(C.startX, nx)),
                hy = Math.ceil(Math.max(C.startY, ny));
            for (let y = ly; y < hy; y++) {
                for (let x = lx; x < hx; x++) {
                    this.map.setBlock(
                        Math.floor(x),
                        Math.floor(y),
                        C.layer,
                        C.blockp[t == 2 ? 1 : 0],
                        C.data
                    );
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
function fillModeToggle() {
    let t = main.ui.fillMode;
    C.fillMode = !C.fillMode;
    if (C.fillMode) {
        t.classList.add("true");
    } else {
        t.classList.remove("true");
    }
}

function getBlockPreview(e) {
    return BLOCKINDEX[e].preview || BLOCKINDEX[e].fill;
}

function requestDataValue() {
    var pa = prompta(
            "Set data values of blocks to...<br><input id=dtv style='width:100%;'></input>"
        ),
        a = document.getElementById("dtv");
    a.value = C.data.join("; ");
    setTimeout(() => {
        a.focus();
        a.select();
    }, 1);
    a.addEventListener("change", function() {
        var p = this.value.split(/\s*;\s*/g),
            pl = p.length;
        for (let i = 0; i < pl; i++) {
            let a = p[i] / 1;
            if (a || a === 0) {
                p[i] = a;
            }
        }
        C.data = p;
        pa.close();
    });
}

addEventListener("keydown", e => {
    var k = e.keyCode;
    C.key[k] = true;
    C.blur = false;
    if (C.prompta) {
        if (k == 27) {
            let a;
            while ((a = document.getElementsByClassName("prompta")).length) {
                a[0].close();
            }
        }
        return;
    }
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
    if (!e.ctrlKey) {
        if (k == 70) {
            fillModeToggle();
        }
        if (k >= 49 && k <= 51) {
            setLayer(k - 49);
        }
        if (k == 82) {
            requestDataValue();
        }
    }
    if (k == 9) {
        let s = e.shiftKey ? 1 : 0;
        e.preventDefault();
        if (!BLOCKINDEX[++C.blockp[s]]) {
            C.blockp[s] = 0;
        }
        main.ui.sel[s].update();
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
    C.startX = (e.clientX - innerWidth / 2) / scale + main.cameraX;
    C.startY = (e.clientY - innerHeight / 2) / scale + main.cameraY;
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
            "Enter level... (int) <br> <input type=text id=in style='width: 100%;'></input> <div id=im class=button>Or import...</div><div id=kbs class=button>View controls</div>"
        ),
        i = document.getElementById("in"),
        m = document.getElementById("im"),
        k = document.getElementById("kbs");
    i.focus();
    i.addEventListener("change", function() {
        a.close();
        res(this.value);
    });
    m.addEventListener("click", function() {
        alert("Work in progress");
    });
    k.addEventListener("click", function() {
        var w = open(
            "levelEditor/controls.txt",
            "",
            "width=524, height=" +
                (innerHeight - 64) +
                ", top=" +
                (screenY + 64) +
                ", left=" +
                screenX
        );
        w.document.title = "Level Editor - Controls";
    });
}).then(e => {
    main = new Main(e);
});
