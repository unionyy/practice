var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    console.log(url.parse(_url, true));

    if(pathname === '/') {

        fs.readdir('./data', function(err, filelist) {
            var list = '<ol>';

                for(var fe of filelist) {
                    list = `${list}<li><a href="/?id=${fe}">${fe}</a></li>`;
                }
                list = list + '</ol>';
            if(queryData.id === undefined) {
                    var title = 'Welcome!';
                    var content = 'Hello, Node.js!';
                    var template = `
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    <p>${content}</p>
                    </body>
                    </html>   
                    `;
                    response.writeHead(200);
                    response.end(template);
            } else {
                fs.readFile('data/'+queryData.id, 'utf8', function(err, content){
                    var title = queryData.id;
                    var template = `
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    <p>${content}</p>
                    </body>
                    </html>   
                    `;
                    response.writeHead(200);
                    response.end(template);
                });
            }
        });
            
    } else {
        // 200: OK, 404: Not OK
        response.writeHead(404);
        response.end('Not found');
    }
      
});
app.listen(3000);