function loadImage(e) {
    var a = document.createElement("img");
    a.src = "img/" + e + ".png";
    return a;
}

try {
    Sound;
} catch (e) {
    console.warn("sounds.js missing");
    window.Sound = function () {};
}

const IMG = {
        floorBlock: loadImage("floorBlock"),
        startBlock: loadImage("startBlock"),
        finishBlock: loadImage("finishBlock"),
        glassBlock: loadImage("glassBlock"),
        brick: loadImage("brick"),
        dirt: loadImage("dirt"),
        grass: loadImage("grass"),
        gravel: loadImage("gravel"),
        log: loadImage("log"),
        wood: loadImage("wood"),
        sand: loadImage("sand"),
        tallGrass: loadImage("tallGrass"),
        player: [{
                idle: loadImage("player/0/idle"),
                jump: loadImage("player/0/jump"),
                walk: [loadImage("player/0/walk/0"), loadImage("player/0/walk/1")]
            },
            {
                idle: loadImage("player/1/idle"),
                jump: loadImage("player/1/jump"),
                walk: [loadImage("player/1/walk/0"), loadImage("player/1/walk/1"), loadImage("player/1/walk/2")]
            }
        ]
    },
    AUDIO = {
        death: new Sound("oof", 0.5)
    }
BLOCKINDEX = {
    NONSOLID: [undefined, 0, 13],
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
    },
    5: {
        name: "Color",
        fill: e => e.data[0],
        preview: "css:background-image: linear-gradient(45deg, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00);",
        caption: "aLL tHe cOloRs!1!!1 \nAs suggested by DR4T",
        data: 1
    },
    6: {
        name: "Brick",
        fill: IMG.brick
    },
    7: {
        name: "Dirt",
        fill: IMG.dirt
    },
    8: {
        name: "Grass",
        fill: IMG.grass
    },
    9: {
        name: "Gravel",
        fill: IMG.gravel
    },
    10: {
        name: "Log",
        fill: IMG.log
    },
    11: {
        name: "Wood",
        fill: IMG.wood
    },
    12: {
        name: "Sand",
        fill: IMG.sand
    },
    13: {
        name: "Tall Grass",
        fill: IMG.tallGrass
    }
};