var http = require('http');
var fs = require('fs');
var path = require('path');
const rootDir = path.resolve(__dirname);
const publicDir = path.join(rootDir, "public");

http.createServer(function (request, response) {
    console.log('request ', request.url);

    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }

    if (filePath.indexOf('\0') !== -1) {
        return respond('That was evil.');
    }

    filePath = path.join(publicDir, filePath);

    if (filePath.indexOf(publicDir) !== 0) {
        console.log('trying to sneak out of the web root?');
        response.writeHead(500);
        response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
response.setHeader('Access-Control-Allow-Origin', '*');
response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
response.setHeader('Access-Control-Allow-Credentials', true);
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(5001);
console.log('Server running at http://127.0.0.1:5001/');
