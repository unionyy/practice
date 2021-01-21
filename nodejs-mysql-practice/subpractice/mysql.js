var mysql      = require('mysql');
const secure = require('../data/secure.json');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : secure['mysqlpw'],
  database : 'mytutorials'
});
 
connection.connect();
 
connection.query('SELECT * from topic', function (error, results, fields) {
  if (error) {
      console.log(err);
  }
  console.log(results);
});
 
connection.end();