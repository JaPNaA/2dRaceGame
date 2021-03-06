class Map {
    constructor(e) {
        var that = this;
        new Promise(function (res) {
            if (window.DEVMODE && DEVMODE.active && DEVMODE.map) {
                res(DEVMODE.map);
                return;
            }
            var x = new XMLHttpRequest();
            x.open("GET", "map/" + e + ".rgm");
            x.responseType = "text";
            x.addEventListener("load", function () {
                res(x.response);
            });
            x.send();
        }).then(function (e) {
            that.load(e);
        });
        this.map = [];
        this.callback = null;
        this.separators = ["Z", "/", "+", ":", ";"];
    }
    load(e) {
        var b = atob(e.replace(/[\n\s]/g, ""))
            .replace(/=/g, "")
            .split(this.separators[0]),
            bl = b.length,
            c = [];
        for (let y = 0; y < bl; y++) {
            let i = b[y];
            if (!i) continue;
            let r = i.split(this.separators[1]),
                rl = r.length,
                f = [];
            for (let x = 0; x < rl; x++) {
                let j = r[x],
                    a = j.split(this.separators[2]),
                    al = a.length;
                for (let z = 0; z < al; z++) {
                    let d = a[z].split(this.separators[3]);
                    a[z] = {
                        id: parseInt(d[0], 36),
                        data: d[1].split(this.separators[4])
                    };
                }
                if (a.find(e => e.id == 2)) {
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
    setBlock(x, y, z, d, dt) {
        var a = this.map[y],
            bi = BLOCKINDEX[d / 1];
        if (!a) return;
        a = a[x];
        if (!a) return;
        if (a[z] === undefined) return false;
        if (bi.data) {
            if (dt && dt.length >= bi.data) {
                a[z].data = dt.slice(0, bi.data);
            } else {
                return false;
            }
        }
        a[z].id = d / 1;
        return true;
    }
    export() {
        var f = [];
        for (let y = 0; y < this.height; y++) {
            let g = [];
            for (let x = 0; x < this.width; x++) {
                let h = [];
                for (let z = 0; z < this.layers; z++) {
                    let b = this.getBlock(x, y, z);
                    h.push(
                        b.id.toString(36) +
                        this.separators[3] +
                        b.data.join(this.separators[4])
                    );
                }
                g.push(h.join(this.separators[2]));
            }
            f.push(g.join(this.separators[1]));
        }
        return btoa(f.join(this.separators[0]));
    }
    newCell() {
        return {
            id: 0,
            data: [""]
        };
    }
    addLine(d, t) {
        switch (d) {
            case 0:
                for (let q = 0; q < (t || 1); q++) {
                    let a = [];
                    for (let i = 0; i < this.width; i++) {
                        let b = [];
                        for (let i = 0; i < this.layers; i++) {
                            b.push(this.newCell());
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
                            x.push(this.newCell());
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
                            x.push(this.newCell());
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
                            b.push(this.newCell());
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