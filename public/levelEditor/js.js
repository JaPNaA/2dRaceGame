// TODO: add "test map" feature

const CVS = document.getElementById("cvs"),
    X = CVS.getContext("2d"),
    C = {
        key: [],
        mousedown: false,
        blockp: [1, 0],
        prompta: 0,
        blur: false,
        layer: 0
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
                    prompta(
                        "Copy/Paste<br><textarea id=txta></textarea> <br> <div id=tstmp class='button'> Test map </div>"
                    );
                    var t = document.getElementById("txta"),
                        m = document.getElementById("tstmp");
                    t.innerHTML = mapToCSV(main.map);
                    t.addEventListener("click", function() {
                        this.select();
                    });
                    m.addEventListener("click", function() {
                        alert("This is work in progress");
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
                    if(a == 0 && i != 0) continue;
                    this.drawBlock(x, y, a, i == 0, i);
                }
            }
        }
    }
    drawBlock(x, y, d, o, z) {
        if (!BLOCKINDEX[d]) return;
        var lum = 0;
        if(z == 2){
            lum = -0.3;
        } else if (z == 1){
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
    }
}

function mapToCSV(e) {
    var f = [];
    for (let y = 0; y < e.height; y++) {
        let g = [];
        for (let x = 0; x < e.width; x++) {
            let h = [];
            for(let z = 0; z < e.layers; z++){
                h.push(e.getBlock(x, y, z));
            }
            g.push(h.join("."));
        }
        f.push(g.join(","));
    }
    return f.join("\n");
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
function setLayer(e) {
    if(!main) return;
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
    C.key[e.keyCode] = true;
    if (C.prompta && e.keyCode == 27) {
        let a;
        while ((a = document.getElementsByClassName("prompta")).length) {
            a[0].close();
        }
    }
    if (e.keyCode >= 49 && e.keyCode <= 51) {
        setLayer(e.keyCode - 49);
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
CVS.addEventListener("mousedown", e => (C.mousedown = e.button));
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

var main;
new Promise(function(res) {
    var a = prompta(
        "Enter level... (int) <br> <input type=text id=in style='width: 100%;'></input>"
    ),
        i = document.getElementById("in");
    i.focus();
    i.addEventListener("change", function() {
        a.close();
        res(this.value);
    });
}).then(e => {
    main = new Main(e);
});
