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
        this.scale = 30;
        this.X = this.canvas.getContext("2d");
        addEventListener("resize", () => that.resize());
        addEventListener("mousemove", () => that.mouseMove());
        addEventListener("keydown", function(e) {
            if (!e.ctrlKey && ![122].includes(e.keyCode)) e.preventDefault();
            that.key[e.keyCode] = true;
        });
        addEventListener("blur", function() {
            that.key.length = 0;
        });
        addEventListener("keyup", function(e) {
            if (!e.ctrlKey) e.preventDefault();
            that.key[e.keyCode] = false;
        });
        this.resize();
    }
    resize(e) {
        if (this.appleIsNotInnovative && this.screen && !e) {
            this.screen.checkForResize();
        } else {
            this.canvas.width = innerWidth;
            this.canvas.height = innerHeight;
            getTr(1, (this.screen && this.screen.scale) || this.scale);
        }
        return this;
    }
    mouseMove() {
        var that = this;
        if (!this.hideMouse) return;
        clearTimeout(this.hideMouseSI);
        this.canvas.style.cursor = "default";
        this.hideMouseSI = setTimeout(function() {
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
