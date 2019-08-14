// connection configurations
let dbConn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node_js_api'
});
// connect to database
dbConn.connect();
