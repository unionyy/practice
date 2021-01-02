var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');


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
                    var html = template.HTML(
                        title, 
                        list, 
                        `<h2>${title}</h2><p>${content}</p>`, 
                        `<a href="/create">Create</a>`
                    );
                    response.writeHead(200);
                    response.end(html);
            } else {
                fs.readFile('data/'+queryData.id, 'utf8', function(err, content){
                    var title = queryData.id;
                    var html = template.HTML(
                        title, 
                        list, 
                        `<h2>${title}</h2><p>${content}</p>`,
                        `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>
                        <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        <form>
                        `
                    );
                    response.writeHead(200);
                    response.end(html);
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
            var html = template.HTML(
                title,
                list,
                `
                <!-- default method="get" -->
                <form action=" /create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                ''
            );
            response.writeHead(200);
            response.end(html);
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
            fs.writeFile(`data/${title}`, content, 'utf8', function(err) {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });

            // console.log(title);
            // console.log(content);
        }); 
        
    } else if(pathname === "/update") {
        fs.readdir('./data', function(err, filelist) {
            var list = '<ol>';
            for(var fe of filelist) {
                list = `${list}<li><a href="/?id=${fe}">${fe}</a></li>`;
            }
            list = list + '</ol>';
            fs.readFile('data/'+queryData.id, 'utf8', function(err, content){
                var title = queryData.id;
                var html = template.HTML(
                    title, 
                    list, 
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" value="${title}"></p>
                        <p>
                            <textarea name="description">${content}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `, 
                    `<a href="/create">Create</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });

    } else if(pathname === '/update_process') {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        
        request.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var content = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function (err) {
                fs.writeFile(`data/${title}`, content, 'utf8', function(err) {
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        });
            
    } else if(pathname === '/delete_process') {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        
        request.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, (err) => {
                response.writeHead(302, {Location: '/'});
                response.end();
            });
        });
            
    } else {
        // 200: OK, 404: Not OK
        response.writeHead(404);
        response.end('Not found');
    }
      
});
app.listen(3000);