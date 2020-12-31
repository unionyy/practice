var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <a href="/create">Create</a>
            ${body}
        </body>
    </html>   
    `;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    // console.log(url.parse(_url, true));

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
                    var template = templateHTML(title, list, `<h2>${title}</h2><p>${content}</p>`);
                    response.writeHead(200);
                    response.end(template);
            } else {
                fs.readFile('data/'+queryData.id, 'utf8', function(err, content){
                    var title = queryData.id;
                    var template = templateHTML(title, list, `<h2>${title}</h2><p>${content}</p>`);
                    response.writeHead(200);
                    response.end(template);
                });
            }
        });
            
    } else if(pathname == "/create") {
        fs.readdir('./data', function(err, filelist) {
            var list = '<ol>';
            for(var fe of filelist) {
                list = `${list}<li><a href="/?id=${fe}">${fe}</a></li>`;
            }
            list = list + '</ol>';
            var title = 'Create';
            var template = templateHTML(title, list,
            `
            <!-- default method="get" -->
            <form action="http://localhost:3000/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `);
            response.writeHead(200);
            response.end(template);
        });
    } else if(pathname === '/create_process') {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var title = post.title;
            var content = post.description;

            console.log(title);
            console.log(content);
        }); 
        response.writeHead(200);
        response.end('succ');
    } else {
        // 200: OK, 404: Not OK
        response.writeHead(404);
        response.end('Not found');
    }
      
});
app.listen(3000);