function loadImage(e) {
    var a = document.createElement("img");
    a.src = "img/" + e;
    return a;
}
const IMG = {
        floorBlock: loadImage("floorBlock.png"),
        startBlock: loadImage("startBlock.png"),
        finishBlock: loadImage("finishBlock.png")
    },
    BLOCKINDEX = {
        NONSOLID: [undefined, 0],
        0: {
            fill: "rgba(0,0,0,0)"
        },
        1: {
            fill: IMG.floorBlock
        },
        2: {
            fill: IMG.startBlock
        },
        3: {
            fill: IMG.finishBlock
        }
    };

async function getMap(e) {
    var a = await new Promise(function(res) {
            var a = new XMLHttpRequest();
            a.open("GET", "map/" + e + ".csv");
            a.addEventListener("load", function() {
                res(a.response);
            });
            a.send();
        }),
        b = a.split("\n"),
        c = [];
    for (let y = 0; y < b.length; y++) {
        let i = b[y];
        if (!i) continue;
        let r = i.split(","),
            f = [];
        for (let x = 0; x < r.length; x++) {
            let j = r[x];
            //* parse j
            if (j == "2") {
                c.startBlock = [x, y];
            }
            f.push(j * 1);
        }
        c.push(f);
    }
    c.width = c[0].length;
    c.height = c.length;
    return c;
}
async function getMap(e) {
    var a = await new Promise(function(res) {
            var a = new XMLHttpRequest();
            a.open("GET", "map/" + e + ".csv");
            a.addEventListener("load", function() {
                res(a.response);
            });
            a.send();
        }),
        b = a.split("\n"),
        c = [],
        d = [];
    for (let y = 0; y < b.length; y++) {
        let i = b[y];
        if (!i) continue;
        let r = i.split(","),
            f = [];
        for (let x = 0; x < r.length; x++) {
            let j = r[x];
            //* parse j
            if (j == "2") {
                d.startBlock = [x, y];
            }
            f.push(j * 1);
        }
        c.push(f);
    }

    d.width = c[0].length;
    d.height = c.length;

    for (let cy = 0; cy < c.length / 16; cy++) {
        let cya = [];
        for (let cx = 0; cx < c[cy].length / 16; cx++) {
            let cxa = [],
                tx = Math.min((cx + 1) * 16, c[cy].length),
                ty = Math.min((cy + 1) * 16, c.length);
            for (let y = cy * 16; y < ty; y++) {
                let ya = [];
                for (let x = cx * 16; x < tx; x++) {
                    ya.push(c[y][x]);
                }
                cxa.push(ya);
            }
            cya.push(cxa);
        }
        d.push(cya);
    }

    d.getBlock = function(x, y) {
        var a = this[Math.floor(y / 16)];
        if (!a) return;
        a = a[Math.floor(x / 16)];
        if (!a) return;
        a = a[y % 16];
        if (!a) return;
        a = a[x % 16];
        return a;
    };
    d.setBlock = function(x, y, d) {
        var a = this[Math.floor(y / 16)];
        if (!a) return false;
        a = a[Math.floor(x / 16)];
        if (!a) return false;
        a = a[y % 16];
        if (!a) return false;
        if (a[x % 16] === undefined) {
            return false;
        } else {
            a[x % 16] = d;
            return true;
        }
    };
    return d;
}
