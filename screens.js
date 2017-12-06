class Screen {
    constructor(C) {
        var that = this;
        this.C = C;
        C.screen = this;
        this.obs = [];
        this.events = {
            mouseover: [],
            mouseout: [],
            mousedown: [],
            mousemove: [],
            mouseup: [],
            click: [],
            keydown: [],
            keyup: []
        };
        this.eventHandler = function(e) {
            for (let i of that.events[e.type]) {
                i(e);
            }
        };
        this.active = true;
        this.sI = 0;
        this.tickLoop = false;
        this.then = Date.now();
    }
    draw() {
        for (let i of this.obs) {
            i.draw(this.C.X);
        }
        return this;
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
    end() {
        this.active = false;
        for (let i in this.events) {
            removeEventListener(i, this.eventHandler, false);
        }
        if (this.tickLoop) {
            clearInterval(this.sI);
        }
        return this;
    }
    checkForResize() {
        var w = innerWidth,
            h = innerHeight,
            n = Date.now(),
            that = this;
        function reqanf() {
            requestAnimationFrame(function() {
                if (
                    w != innerWidth ||
                    h != innerHeight ||
                    Date.now() - n > 500
                ) {
                    that.C.resize(1);
                    that.draw();
                    getTr(1);
                    return;
                }
                reqanf();
            });
        }
        reqanf();
        return this;
    }
    on(t, f) {
        this.events[t].push(f);
        return this;
    }
}

class StartScreen extends Screen {
    constructor(C) {
        super(C);

        var that = this;
        this.obs.push({
            draw: function(X) {
                X.sFill("#000");
                X.uText("Mario Ripoff", 0, -1, "#FFF", "2px Arial", 1);
                X.uText(
                    "WASD or Arrow keys to move\nHold shift to go down/slower\nPress tab to go freecam",
                    0,
                    0,
                    "#FFF",
                    ".75px Arial",
                    1
                );
                X.uText("CLICK TO START", 0, 5, "#888", ".6px monospace", 1);
                // X.uGrid();
            }
        });
        this.on("click", function(){
            that.end();
            main.game();
        });
    }
}

class GameScreen extends Screen {
    constructor(C) {
        super(C);

        this.game = new Game(this, 0);
        this.obs.push(this.game);
        this.tickLoop = true;
        C.hideMouse = true;
    }
    addPlayer(e) {
        this.game.addPlayer(e);
    }
    tick(t) {
        var n = Date.now();
        t.game.tick((n - t.then) / 1e3);
        t.then = n;
    }
}
