const http = require("http"),
    fs = require("fs");

http.createServer(function(q, r) {
    try {
        var url = "public" + (q.url.length == 1 ? "/index.html" : q.url),
            odt = false,
            mime = url.split(".");
        mime = mime[mime.length - 1];
        if (mime == "css") {
            mime = "text/css";
        }
        fs.readFile(url, function(e, c) {
            console.log(url);
            if (e) {
                r.writeHead(404, {
                    "content-type": "text/html"
                });
                fs.readFile("responsePage/404.html", function(e, c) {
                    if (e) return;
                    r.end(c.toString());
                });
                return;
            }
            r.writeHead(200, {
                "content-type": mime || "text/plain"
            });
            r.end(c);
        });
    } catch (e) {
        r.writeHead(500, {
            "content-type": "text/html"
        });
        fs.readFile("responsePage/500.html", function(er, c) {
            r.end(
                c
                    .toString()
                    .replace(
                        /{error}/,
                        [e.toString(), e.fileName, e.lineNumber].join("\n")
                    )
            );
        });
    }
}).listen(1337);
