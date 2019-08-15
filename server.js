let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// default route
app.get('/', function (req, res) {
  return res.send({ error: true, message: 'hello' })
});
// connection configurations
let dbConn = mysql.createConnection({
  host: 'trabajo-practico.c91cbeurpah9.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '12345678',
  database: 'trabajo-practico',
  port: 3306
});

// connect to database
dbConn.connect();


// Retrieve all products
app.get('/productos', function (req, res) {
  dbConn.query('SELECT * FROM productos', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Listado de productos' });
  });
});


// Retrieve Product with id
app.get('/productos/:id', function (req, res) {

  let productoId = req.params.id;

  if (!productoId) {
    return res.status(400).send({ error: true, message: 'Please provide a productoId' });
  }

  dbConn.query('SELECT * FROM productos WHERE id=?', productoId, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results[0], message: 'productos list.' });
  });

});


// Add a new product
app.post('/productos', function (req, res) {

  let producto = req.body.producto;

  if (!producto) {
    return res.status(400).send({ error:true, message: 'Please provide product' });
  }

  dbConn.query("INSERT INTO productos SET ? ", { producto: producto }, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New producto has been created successfully.' });
  });
});


//  Update producto with id
app.put('/productos', function (req, res) {

  let productoId = req.body.productoId;
  let producto = req.body.producto;

  if (!productoId || !producto) {
    return res.status(400).send({ error: producto, message: 'Please provide productor and productoId' });
  }

  dbConn.query("UPDATE productos SET producto = ? WHERE id = ?", [producto, producto_id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'producto has been updated successfully.' });
  });
});


//  Delete producto
app.delete('/productos', function (req, res) {

  let productoId = req.body.producto_id;

  if (!productoId) {
    return res.status(400).send({ error: true, message: 'Please provide product_id' });
  }
  dbConn.query('DELETE FROM productos WHERE id = ?', [productoId], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Product has been updated successfully.' });
  });
});

// set port
app.listen(5000, function () {
  console.log('Node app is running on port 5000');
});

module.exports = app;
