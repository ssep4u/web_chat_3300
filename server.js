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
