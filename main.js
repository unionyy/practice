const express = require('express');
const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const bodyParser = require('body-parser');
const { nextTick } = require('process');
const port = 3000;

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('*', (req, res, next) => {
  //console.log('my middleware');
  fs.readdir('./data', function (error, filelist) {
    req.list = template.list(filelist);
    next();
  });
})

app.get('/', (req, res) => {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = req.list;
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}
     <img src="http://localhost:3000/images/hello.jpg" style="width: 400px; display: block; margin-top: 10px;">
    `,
    `<a href="/create">create</a>`
  );
  res.send(html);
});

app.get('/page/:pageID', (req, res) => {
  var filteredId = path.parse(req.params.pageID).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    var title = req.params.pageID;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ['h1']
    });
    var list = req.list;
    var html = template.HTML(sanitizedTitle, list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      ` <a href="/create">create</a>
                    <a href="/update/${sanitizedTitle}">update</a>
                    <form action="/delete_process" method="post">
                      <input type="hidden" name="id" value="${sanitizedTitle}">
                      <input type="submit" value="delete">
                    </form>`
    );
    res.writeHead(200);
    res.end(html);
  });
});

app.get('/create', (req, res) => {
  var title = 'WEB - create';
  var list = req.list;
  var html = template.HTML(title, list, `
              <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
            `, '');
  res.send(html);
});

app.post('/create_process', (req, res) => {
  var post = req.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
    res.redirect(`/page/${title}`);
  });
});

app.get('/update/:updateID', (req, res) => {
    var filteredId = path.parse(req.params.updateID).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      var title = req.params.updateID;
      var list = req.list;
      var html = template.HTML(title, list,
        `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                  <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
        `<a href="/create">create</a> <a href="/update/${title}">update</a>`
      );
      res.send(html);
    });
});

app.post('/update_process', (req, res) => {
  var post = req.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function (error) {
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      res.redirect(`/page/${title}`);
    });
  });
});

app.post('/delete_process', (req, res) => {
  var post = req.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


// var http = require('http');
// var url = require('url');



// var app = http.createServer(function(request,response){
//     var _url = request.url;
//     var queryData = url.parse(_url, true).query;
//     var pathname = url.parse(_url, true).pathname;
//     if(pathname === '/'){
//       if(queryData.id === undefined){
//     } else if(pathname === '/create'){
//
//     } else if(pathname === '/create_process'){
//
//     } else if(pathname === '/update'){
//
//     } else if(pathname === '/update_process'){
//       
//     } else if(pathname === '/delete_process'){
//       
//     } else {
//       response.writeHead(404);
//       response.end('Not found');
//     }
// });
// app.listen(3000);
