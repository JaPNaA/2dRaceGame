class Sound {
    constructor(s, v) {
        var that = this;
        Object.defineProperties(this, {
            src: {
                get: () => that._src,
                set: e => {
                    var n = "audio/" + e + ".mp3";
                    that._src = n;
                    for (let i of that.channels) {
                        i.src = n;
                        i.load();
                    }
                }
            },
            volume: {
                get: () => that._volume,
                set: e => {
                    that._volume = e;
                    for (let i of that.channels) {
                        i.volume = e;
                    }
                }
            }
        });
        this._src = "";
        this._volume = 1;

        this.channels = [];
        this.createNewChannel();

        this.src = s;
        v && (this.volume = v);
    }
    play(v) {
        for (let i of this.channels) {
            if (i.paused) {
                i.volume = v || this.volume;
                i.currentTime = 0;
                return i.play();
            }
        }
        this.createNewChannel().play();
    }
    createNewChannel() {
        var a;
        if (this.channels[0]) {
            a = this.channels[0].cloneNode(false);
        } else {
            a = new Audio(this._src);
        }
        a.currentTime = 0;
        a.preload = true;
        this.channels.push(a);
        return a;
    }
}