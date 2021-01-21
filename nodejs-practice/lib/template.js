const { Module } = require("module");

module.exports = {
    HTML: function (title, list, body, control) {
        return `
        <!doctype html>
        <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB1</a></h1>
                ${list}
                ${control}
                ${body}
            </body>
        </html>   
        `;
    }
}