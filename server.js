let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
let cors = require('cors')
let meli = require('mercadolibre')
let request = require('request')

app.use(cors())
app.options('*', cors())

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
  host: '127.0.0.1',
  user: 'root',
  password: 'lokiloki',
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
app.get('/productos/:sku', function (req, res) {

  let productoSKU = req.params.sku;

  if (!productoSKU) {
    return res.status(400).send({ error: true, message: 'Please provide a productoId' });
  }

  dbConn.query('SELECT * FROM productos WHERE sku=?', [productoSKU], function (error, results, fields) {
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

  dbConn.query("INSERT INTO productos SET ? ", { ...producto }, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New producto has been created successfully.' });
  });
});


//  Update producto with id
app.put('/productos/:sku', function (req, res) {

  let productoSKU = req.params.sku;
  let producto = req.body.producto;

  if (!productoSKU || !producto) {
    return res.status(400).send({ error: producto, message: 'Please provide productor and productoSKU' });
  }

  dbConn.query("UPDATE productos SET ? WHERE sku = ? ", [{...producto}, productoSKU], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'producto has been updated successfully.' });
  });
});


//  Delete producto
app.delete('/productos/:sku', function (req, res) {

  let productoSKU = req.params.sku;

  if (!productoSKU) {
    return res.status(400).send({ error: true, message: 'Please provide productoSKU' });
  }
  dbConn.query('DELETE FROM productos WHERE sku = ?', [productoSKU], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Product has been updated successfully.' });
  });
});

const basePath = "https://api.mercadolibre.com";
const token="APP_USR-353126405683468-091903-15aa032fa58b6995685e2092ddc1ad33-60708402";

app.post("/ML-WEBHOOK", (req,res) => {

  let sku = req.body.resource.split(',')[1];

  console.log(sku)
  let stock;

  dbConn.query('SELECT * FROM productos WHERE sku=?', [sku], function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    return stock = results[0] ? results[0].stock : 0;
  });

  request({uri: basePath + req.body.resource, method: "GET", json: true}, function (error, response, body) {

    let option = {
      uri: basePath + "/answers?access_token=" + token,
      method: "POST",
      json: true,
      body: {'question_id': body.id, 'text': stock > 0 ? 'Hay stock' : 'No hay stock'}
    }

    request(option, function (error, response, body) {})

    res.send();
  })
});

// set port
app.listen(5000, function () {
  console.log('Node app is running on port 5000');
});

module.exports = app;
