class Canvas {
    constructor() {
        var that = this;
        this.bgColor = "rgba(0, 0, 0, 0)";
        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("fmCvs");
        this.canvas.style.backgroundColor = this.bgColor;

        this.appleIsNotInnovative = navigator.userAgent.match(
            /iPad|iPhone|iPod/
        );
        this.screen = null;
        this.hideMouse = false;
        this.hideMouseSI = 0;
        this.key = [];
        this.touch = [];
        this.touchdown = false;
        this.startTouch = [];
        this.touchPos = [];
        this.scale = 30;
        this.X = this.canvas.getContext("2d");
        this.touchEnabled = false;

        addEventListener("touchstart", function (e) {
            e.preventDefault();
            that.touchEnabled = true;

            if (!that.touchdown) {
                let t = e.touches[0],
                    s = that.startTouch;
                s[0] = t.clientX;
                s[1] = t.clientY;
            }

            that.touchdown = true;
        }, {
            passive: false
        });
        addEventListener("touchmove", function (e) {
            e.preventDefault();
            var a = e.changedTouches[0],
                b = that.touchPos;
            b[0] = a.clientX;
            b[1] = a.clientY;

            that.touch.length = 0;
            if (b[0] > that.startTouch[0] + 32) {
                that.touch[3] = true;
            } else if (b[0] < that.startTouch[0] - 32) {
                that.touch[1] = true;
            }
            if (b[1] > that.startTouch[1] - 32) {
                that.touch[4] = true;
            } else if (b[1] < that.startTouch[1] + 32) {
                that.touch[0] = true;
            }

        }, {
            passive: false
        });
        addEventListener("touchend", function (e) {
            e.preventDefault();
            that.touch.length = 0;
            if (e.touches.length == 0) that.touchdown = false;
        }, {
            passive: false
        });

        addEventListener("resize", () => that.resize());
        addEventListener("mousemove", () => that.mouseMove());
        addEventListener("keydown", function (e) {
            if (!e.ctrlKey && ![122].includes(e.keyCode)) e.preventDefault();
            that.key[e.keyCode] = true;
        });
        addEventListener("blur", function () {
            that.key.length = 0;
        });
        addEventListener("keyup", function (e) {
            if (!e.ctrlKey) e.preventDefault();
            that.key[e.keyCode] = false;
        });
        addEventListener("contextmenu", e => e.preventDefault());
        this.resize();
    }
    resize(e) {
        if (this.appleIsNotInnovative && this.screen && !e) {
            this.screen.checkForResize();
        } else {
            let r = devicePixelRatio || 1;
            this.canvas.width = innerWidth * r;
            this.canvas.height = innerHeight * r;
            getTr(1, (this.screen && this.screen.scale) || this.scale);
        }
        return this;
    }
    mouseMove() {
        var that = this;
        if (!this.hideMouse) return;
        clearTimeout(this.hideMouseSI);
        this.canvas.style.cursor = "default";
        this.hideMouseSI = setTimeout(function () {
            if (!that.hideMouse) return;
            that.canvas.style.cursor = "none";
        }, 1500);
    }
    remove() {
        this.canvas.parentElement.removeChild(this.canvas);
        return this;
    }
    append(e) {
        if (e) {
            e.appendChild(this.canvas);
        } else {
            document.body.appendChild(this.canvas);
        }
        return this;
    }
}