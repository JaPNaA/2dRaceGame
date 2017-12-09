function parseMap(map) {
    var a = map,
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
    return d;
}
console.log(parseMap(map));
