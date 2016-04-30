var express = require("express");
var methodOverride  = require("method-override");
var mongoose = require('mongoose');
var bodyParser=require('body-parser');
var session = require("express-session");
var passport = require('passport');


require('./config/passport')(passport); // pass passport for configuration

require('mongoose-middleware').initialize(mongoose);
mongoose.connect('mongodb://localhost/flivess', function(err, res) {
    if(err) throw err;
    console.log('Conectados con éxito a la Base de Datos');
});

var app = express ();
app.all('/*', function(req, res, next) {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-Allow-Origin');
    res.header("Access-Control-Max-Age", "86400"); // 24 hours

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
});

//configure passport object through config/passport.js
app.use(session({ secret: 'zasentodalaboca' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//This goes before the routes are called


app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());


app.use(express.static(__dirname + "/public")); // FRONT-END---> aqui es donde tendremos nuestro html y ccs e imagenes.

var router = express.Router();
// API Rutas
routes = require('./routes/users')(app);
routes = require('./routes/friends')(app);
routes = require('./routes/messages')(app);
routes = require('./routes/login')(app);
routes = require('./routes/facebook')(app,passport);


var server = require('http').Server(app);

// Start server
server.listen(8080, function() {
    console.log("Node server running on http://localhost:8080");
});