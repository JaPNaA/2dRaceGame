function loadImage(e) {
    var a = document.createElement("img");
    a.src = "img/" + e;
    return a;
}
const IMG = {
        floorBlock: loadImage("floorBlock.png"),
        startBlock: loadImage("startBlock.png"),
        finishBlock: loadImage("finishBlock.png"),
        glassBlock: loadImage("glassBlock.png"),
        player: loadImage("player.png")
    },
    BLOCKINDEX = {
        NONSOLID: [undefined, 0],
        0: {
            name: "Air",
            fill: "rgba(0,0,0,0)",
            caption: "I can't see it."
        },
        1: {
            name: "Cobblestone",
            fill: IMG.floorBlock,
            caption: "Life"
        },
        2: {
            name: "Start Block",
            fill: IMG.startBlock,
            caption: "'Spawnpoint block'"
        },
        3: {
            name: "Finish Block",
            fill: IMG.finishBlock,
            caption: "When players touch this, they win"
        },
        4: {
            name: "Glass",
            fill: IMG.glassBlock,
            caption: "It's transparent"
        }
    };

class Map {
    constructor(e) {
        var that = this;
        new Promise(function(res) {
            if(window.DEVMODE && DEVMODE.active && DEVMODE.map){
                res(DEVMODE.map);
                return;
            }
            var x = new XMLHttpRequest();
            x.open("GET", "map/" + e + ".rgm");
            x.responseType = "text";
            x.addEventListener("load", function() {
                res(x.response);
            });
            x.send();
        }).then(function(e) {
            that.load(e);
        });
        this.map = [];
        this.callback = null;
    }
    load(e) {
        var b = atob(e.replace(/[\n\s]/g, ""))
                .replace(/=/g, "")
                .split("Z"),
            c = [];
        for (let y = 0; y < b.length; y++) {
            let i = b[y];
            if (!i) continue;
            let r = i.split("/"),
                f = [];
            for (let x = 0; x < r.length; x++) {
                let j = r[x],
                    a = j.split("+"),
                    al = a.length;
                for (let z = 0; z < al; z++) {
                    a[z] = a[z] / 1; // convert to number because bugs
                }
                if (a.includes(2)) {
                    this.startBlock = [x, y];
                }
                f.push(a);
            }
            c.push(f);
        }

        this.width = c[0].length;
        this.height = c.length;
        this.layers = typeof c[0][0] == "string" ? 1 : c[0][0].length;
        this.map = c;
        this.callback(this);
    }
    getBlock(x, y, z) {
        var a = this.map[y];
        if (!a) return;
        a = a[x];
        if (!a) return;
        if (z === undefined) {
            return a;
        } else {
            return a[z];
        }
    }
    setBlock(x, y, z, d) {
        var a = this.map[y];
        if (!a) return;
        a = a[x];
        if (!a) return;
        if (a[z] === undefined) return false;
        a[z] = d;
        return true;
    }
    export() {
        var f = [];
        for (let y = 0; y < this.height; y++) {
            let g = [];
            for (let x = 0; x < this.width; x++) {
                let h = [];
                for (let z = 0; z < this.layers; z++) {
                    h.push(this.getBlock(x, y, z).toString(36));
                }
                g.push(h.join("+"));
            }
            f.push(g.join("/"));
        }
        return btoa(f.join("Z"));
    }
    addLine(d, t) {
        switch (d) {
            case 0:
                for (let q = 0; q < (t || 1); q++) {
                    let a = [];
                    for (let i = 0; i < this.width; i++) {
                        let b = [];
                        for (let i = 0; i < this.layers; i++) {
                            b.push(0);
                        }
                        a.push(b);
                    }
                    this.map.push(a);
                    this.height++;
                }
                break;
            case 1:
                for (let q = 0; q < (t || 1); q++) {
                    for (let y of this.map) {
                        let x = [];
                        for (let i = 0; i < this.layers; i++) {
                            x.push(0);
                        }
                        y.push(x);
                    }
                    this.width++;
                }
                break;
            case 2:
                for (let q = 0; q < (t || 1); q++) {
                    for (let y of this.map) {
                        let x = [];
                        for (let i = 0; i < this.layers; i++) {
                            x.push(0);
                        }
                        y.unshift(x);
                    }
                    this.width++;
                }
                break;
            case 3:
                for (let q = 0; q < (t || 1); q++) {
                    let a = [];
                    for (let i = 0; i < this.width; i++) {
                        let b = [];
                        for (let i = 0; i < this.layers; i++) {
                            b.push(0);
                        }
                        a.push(b);
                    }
                    this.map.unshift(a);
                    this.height++;
                }
                break;
        }
    }
    removeLine(d, t) {
        switch (d) {
            case 0:
                for (let q = 0; q < (t || 1); q++) {
                    this.map.pop();
                    this.height--;
                }
                break;
            case 1:
                for (let q = 0; q < (t || 1); q++) {
                    for (let y of this.map) {
                        y.pop();
                    }
                    this.width--;
                }
                break;
            case 2:
                for (let q = 0; q < (t || 1); q++) {
                    for (let y of this.map) {
                        y.shift();
                    }
                    this.width--;
                }
                break;
            case 3:
                for (let q = 0; q < (t || 1); q++) {
                    this.map.shift();
                    this.height--;
                }
                break;
        }
    }
    then(e) {
        this.callback = e;
        return this;
    }
}
