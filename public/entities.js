class Entity {
    constructor(g) {
        this.control = 0; // 0: AI, 1: Manually, 2: WebSockt
        this.width = 0.8;
        this.height = 1;
        this.x = 0;
        this.y = 0;
        this.frame = 0;
        this.vx = 0;
        this.vy = 0;
        this.game = g;
        this.gravity = 0.45;
    }
    draw(X, cx, cy) {
        //* add animation
        X.uRect(this.x - cx, this.y - cy, this.width, this.height, "#F00");
    }
    tick() {}
}
class Player extends Entity {
    constructor(g) {
        super(g);
        var sb = this.game.map.startBlock;
        if(!sb){
            throw "Map not loaded, cannot place player";
        }

        this.control = 1;
        this.lastK = {
            u: false,
            d: false,
            l: false,
            r: false
        };
        this.x = sb[0];
        this.y = sb[1] - this.height;
    }
    tick(tt) {
        this.physics(tt);
        this.kbControl(tt);
    }
    physics(tt) {
        this.x += this.vx * tt;
        this.y += this.vy * tt;
        this.vx *= 0.995 ** (tt * 1e3);
        this.vy *= 0.995 ** (tt * 1e3);

        var a;
        if ((a = this.game.block(1, this))) {
            if (this.vx < 0) {
                this.vx = 0;
                this.x = a[0] + 1;
            }
        }
        if ((a = this.game.block(2, this))) {
            if (this.vx > 0) {
                this.vx = 0;
                this.x = a[0] - this.width;
            }
        }
        if ((a = this.game.block(3, this))) {
            if (this.vy < 0) {
                this.vy = 0;
                this.y = a[1] + this.height;
            }
        }
        if ((a = this.game.block(0, this))) {
            if (this.vy > 0) {
                this.vy = 0;
                this.y = a[1] - this.height;
            }
            this.grounded = true;
        } else {
            this.grounded = false;
            this.vy += this.gravity;
        }
    }
    kbControl(tt) {
        if (
            this.control != 1 ||
            this.game.cameraFocus !== this ||
            this.game.freeCam
        )
            return;
        var k = this.game.screen.C.key,
            s = 0.1,
            b = s * 60;
        if (k[87] || k[38] || k[32]) {
            // up
            if (this.grounded) {
                this.vy -= this.gravity * 75;
                // this.vy -= s;
                this.lastK.u = true;
            }
        } else {
            this.lastK.u = false;
        }

        if (k[83] || k[40] || k[16]) {
            // down
            this.vy += s;
            this.lastK.d = true;
        } else {
            this.lastK.d = false;
        }

        if (k[65] || k[37]) {
            // left
            if (this.lastK.l) {
                this.vx -= s;
            } else {
                this.vx -= k[16] ? s : b;
                this.lastK.l = true;
            }
        } else {
            this.lastK.l = false;
        }

        if (k[68] || k[39]) {
            // right
            if (this.lastK.r) {
                this.vx += s;
            } else {
                this.vx += k[16] ? s : b;
                this.lastK.r = true;
            }
        } else {
            this.lastK.r = false;
        }
    }
}