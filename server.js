const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 3300;
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { Allow: 'GET, HEAD' });
        return res.end('Method Not Allowed');
    }

    let requestedPath;
    try {
        requestedPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    } catch {
        res.writeHead(400);
        return res.end('Bad Request');
    }

    const filePath = path.resolve(ROOT, `.${requestedPath === '/' ? '/index.html' : requestedPath}`);

    if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${path.sep}`)) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    fs.stat(filePath, (statError, stats) => {
        if (statError || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('Not Found');
        }

        const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        if (req.method === 'HEAD') return res.end();
        fs.createReadStream(filePath).on('error', () => res.destroy()).pipe(res);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Static file server: http://${HOST}:${PORT}`);
    console.log(`Serving directory: ${ROOT}`);
});


//-----------Welcome WebSocketServer World------------------
const { WebSocketServer } = require("ws");
const clients = new Set();  //집합: 중복X
let nextMessageId = 0;      //broadcastMessage id: 1씩 증가. 고유의 값

function broadcast(broadcastMessage) {
    //broadcastMessage -> string: data
    const data = JSON.stringify(broadcastMessage);  //json -> string
    //clients 목록에서 하나씩 꺼내어 client -> 상태 === WebSocket.OPEN 인 client.send(data);
    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    }
}

// http 서버: 정적 파일(html, css, js, ...) 서비스
// WebSocket 서버: 실시간 서비스
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("클라이언트 연결");
    // clients 목록에 client 추가하자
    clients.add(ws);

    //client 에서 send 한 것을 받는 위치
    ws.on("message", (data) => {
        let json;
        try {
            json = JSON.parse(data);    //string -> json
        } catch (error) {
            return; //이상한 메시지 무시(안 그러면 서버 die)
        }

        switch(json.type) {
            case "chat":
                console.log("chat 수신: ", json.text);
                const broadcastMessage = {
                    type: json.type, 
                    text: json.text,
                    id: nextMessageId++,
                    timestamp: Date.now()
                };
                broadcast(broadcastMessage);
                console.log("broadcast: ", broadcastMessage);
                break;
        }
    });
    ws.on("close", () => {
        console.log("클라이언트 연결 해제")
        // client 목록에서 client 삭제하자
        clients.delete(ws);
    });
});