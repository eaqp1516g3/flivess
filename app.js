var express = require("express");
var mongojs= require("mongojs");
var methodOverride  = require("method-override");
var mongoose = require('mongoose');
var bodyParser=require('body-parser');
var mongoose=require("mongoose");


require('mongoose-middleware').initialize(mongoose);
mongoose.connect('mongodb://localhost/flivess', function(err, res) {
    if(err) throw err;
    console.log('Conectados con éxito a la Base de Datos');
});

var app = express ();
app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});






app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());


app.use(express.static(__dirname + "/public")); // FRONT-END---> aqui es donde tendremos nuestro html y ccs e imagenes. Esta carpeta tiene que estar en la misma carpeta que esta el server.js

var router = express.Router();
// API Rutas
routes = require('./routes/users')(app);
routes = require('./routes/friends')(app);
routes = require('./routes/messages')(app);


var server = require('http').Server(app);

// Start server
server.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});



