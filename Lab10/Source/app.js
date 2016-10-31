var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
        register = fs.readFileSync('register.html');
    html = fs.readFileSync('index.html');
    register = fs.readFileSync('register.html');
    main = fs.readFileSync('main.html');


var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                console.log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                console.log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } 
else if (req.method === 'GET')
{
    if (req.url === '/main.html') {
                res.writeHead(200);
                res.write(main);
                res.end();
                console.log('Rendering main.html');
            }
    else if (req.url === '/register.html') {
                res.writeHead(200);
                res.write(register);
                
                res.end();
                console.log('Rendering register.html');
            }
            else {
                res.writeHead(200);
                res.write(html);
                res.end();
    }
}


else {
        res.writeHead(200);
        res.write(html);
        res.end();
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
