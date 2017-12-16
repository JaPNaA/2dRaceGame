// util[ities].js

function getTr(e, s, ofy, ofx) {
    // get offset and scale: param boolean e: reload data
    if (!e && getTr.p) return getTr.p;
    var v = s || 30,
        r = {
            sc: null,
            tx: innerWidth / 2,
            ty: innerHeight / 2
        };
    if (innerWidth < innerHeight * 16 / 9) {
        r.sc = window.scale || innerHeight / v * 16 / 9;
    } else {
        r.sc = window.scale || innerWidth / v;
    }
    r.tx += (ofx || 0) * r.sc;
    r.ty += (ofy || 0) * r.sc;
    return (getTr.p = r);
}

/*
    X.[type][Name]
        type: "s"/"u"
            s: without transformations
            u: with transformations
*/
CanvasRenderingContext2D.prototype.sLine = function(x, y, a, b, s, t) {
    // draw line
    s && (this.strokeStyle = s);
    t && (this.lineWidth = t);
    this.beginPath();
    this.moveTo(x, y);
    this.lineTo(a, b);
    this.stroke();
    this.closePath();
};
CanvasRenderingContext2D.prototype.sSetup = function() {
    // transform context
    var { sc, tx, ty } = getTr();
    this.save();
    this.translate(tx, ty);
    this.scale(sc, sc);
    this.imageSmoothingEnabled = false;
};

CanvasRenderingContext2D.prototype.sFill = function(c) {
    // fill canvas
    this.fillStyle = c;
    this.fillRect(0, 0, this.canvas.width, this.canvas.height);
};
CanvasRenderingContext2D.prototype.uText = function(e, x, y, c, f, a) {
    // write text
    this.sSetup();

    this.font = f || "1px Arial";
    c && (this.fillStyle = c);
    var t = e.split("\n"),
        fs = this.font.match(/^([0-9]|\.)+/)[0] * 1;
    for (let i = 0; i < t.length; i++) {
        let e = t[i];
        if (a) {
            var tm = this.measureText(e).width;
        }
        switch (a) {
            case 1:
                this.fillText(e, x - tm / 2, y + i * fs);
                break;
            case 2:
                this.fillText(e, x - tm, y + i * fs);
                break;
            default:
                this.fillText(e, x, y + i * fs);
        }
    }

    this.restore();
};
CanvasRenderingContext2D.prototype.uGrid = function() {
    // draw grid
    var sc = getTr().sc;

    this.strokeStyle = "#F00";
    this.lineWidth = 1;
    for (let y = 0; y < innerHeight / sc; y++) {
        this.sLine(0, y * sc, 40 * sc, y * sc);
    }

    for (let x = 0; x < innerWidth / sc; x++) {
        this.sLine(x * sc, 0, x * sc, 40 * sc);
    }

    this.sLine(innerWidth / 2, 0, innerWidth / 2, 40 * sc, "#0F0", 2);
    this.sLine(0, innerHeight / 2, 40 * sc, innerHeight / 2, "#0F0", 2);
};
CanvasRenderingContext2D.prototype.uBlock = function(
    x,
    y,
    c,
    sx,
    sy,
    sw,
    sh,
    o
) {
    // draw block
    this.sSetup();

    if (typeof c == "string") {
        this.fillStyle = c;
        this.fillRect(x, y, 1, 1);
    } else {
        if (o && o.lum && o.lum > 0) this.globalAlpha = 1 - o.lum;
        this.drawImage(
            c,
            sx || 0,
            sy || 0,
            sw || c.width,
            sh || c.height,
            x,
            y,
            1,
            1
        );
    }
    if (o && o.outline) {
        this.beginPath();
        this.lineWidth = 0.02;
        this.strokeStyle = "#F00";
        this.globalAlpha = 0.5;
        this.rect(x, y, 1, 1);
        this.stroke();
        this.closePath();
        this.globalAlpha = 1;
    }
    if (o && o.lum && o.lum < 0) {
        this.fillStyle = "rgba(0, 0, 0, " + Math.abs(o.lum) + ")";
        this.fillRect(x, y, 1, 1);
    }

    this.restore();
};
CanvasRenderingContext2D.prototype.uRect = function(x, y, w, h, c) {
    // draw rectangle (with transformations)
    this.sSetup();

    this.fillStyle = c;
    this.fillRect(x, y, w, h);

    this.restore();
};
CanvasRenderingContext2D.prototype.uImg = function(
    c,
    sx,
    sy,
    sw,
    sh,
    x,
    y,
    w,
    h,
    f
) {
    this.sSetup();

    if (f) {
        this.translate(w, 0);
        this.scale(-1, 1);
    }
    this.drawImage(
        c,
        sx || 0,
        sy || 0,
        sw || c.width,
        sh || c.height,
        x,
        y,
        w,
        h
    );

    this.restore();
};

Array.prototype.last = function() {
    return this[this.length - 1];
};
