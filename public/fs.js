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
    for (let i of b) {
        if (!i) continue;
        let r = i.split(","),
            f = [];
        for (let j of r) {
            //* parse j
            f.push(j * 1);
        }
        c.push(f);
    }
    return c;
}
