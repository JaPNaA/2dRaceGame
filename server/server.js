const http = require("http"),
    fs = require("fs"),
    os = require("os"),
    pointers = {
        "/leveleditor": "/levelEditor/index.html",
        "/admin": "/admin/index.html"
    };

class Server {
    constructor() {
        this.port = process.env.PORT || 80;
        this.server = http.createServer(this.listener);
        this.connectors = this.getConnectors();
    }
    listener(q, r) {
        var url = q.url,
            odt = false,
            mime; 
            
        {
            let urlLc = url.toLowerCase();
            if (url.length <= 1) {
                url = "/index.html";
            }
            url = pointers[urlLc] || url;
            url = "public" + url;
        }
        mime = url.split(".");
        mime = mime[mime.length - 1];
        if (["css", "js", "html", "rgm"].includes(mime)) {
            mime = "text/" + mime;
        } else if (["png", "jpg", "jpeg", "bmp"].includes(mime)) {
            mime = "img/" + mime;
        }
        fs.readFile(url, function (e, c) {
            if (e) {
                r.writeHead(404, {
                    "content-type": "text/html"
                });
                fs.readFile("responsePage/404.html", function (e, c) {
                    if (e) return;
                    r.end(c);
                });
                return;
            }
            r.writeHead(200, {
                "content-type": mime || "text/plain"
            });
            r.end(c);
            console.log(q.connection.remoteAddress + " -> " + url + " :" + mime + ", " + (e ? 404 : 200));
        });
    }
    listen() {
        var that = this;
        this.server.listen(this.port, () => {
            let p = that.server.address().port;
            console.log("Hosting on port: " + p);
            that.port = p;
        });

        var port = 1024;
        this.server.on("error", function () {
            console.log("Failed to host!\n");
            console.log("Searching for open ports...");
            that.server.listen(port++);
        });
        return this;
    }
    getConnectors() {
        var ni = os.networkInterfaces(),
            h = [];
        for (let i in ni) {
            for (let j of ni[i]) {
                if (j.family == "IPv4") {
                    h.push(j.address);
                }
            }
        }
        return h;
    }
}
module.exports = {
    Server: Server
};