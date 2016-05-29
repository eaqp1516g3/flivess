var express = require("express"),
methodOverride  = require("method-override"),
mongoose = require('mongoose'),
bodyParser=require('body-parser'),
session = require("express-session"),
passport = require('passport'),
formidable = require('formidable'),
path = require("path"),
app = express (),
socket_server = require('http').Server(app),
io = require('socket.io')(socket_server);

require('./config/passport')(passport); // pass passport for configuration

require('mongoose-middleware').initialize(mongoose);
mongoose.connect('mongodb://localhost/flivess', function(err) {
    if(err) throw err;
    console.log('Conectados con éxito a la Base de Datos');
});

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

app.use(bodyParser());
app.use(bodyParser({uploadDir:'./img'}));
app.use(bodyParser({uploadDir:'./tracks'}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb'}));
//app.use(bodyParser.urlencoded({ extended: false }));  
//app.use(bodyParser.json());  
app.use(methodOverride());





app.use(express.static(__dirname + "/public")); // FRONT-END---> aqui es donde tendremos nuestro html y ccs e imagenes.

var router = express.Router();
// API Rutas
routes = require('./routes/users')(app);
routes = require('./routes/friends')(app);
routes = require('./routes/messages')(app);
routes = require('./routes/login')(app);
routes = require('./routes/facebook')(app,passport);
routes = require('./routes/tracks')(app);
routes = require('./routes/notifications')(app);

var server = require('http').Server(app);

// Start server
server.listen(8080, function() {
    console.log("Node server running on http://localhost:8080");
});







//SERVIDOR PARA EL SOCKET
var notification = require('./models/notification.js');
var usuario = require('./models/user.js');
var follow = require('./models/friend.js');
var users={};

io.on('connection', function(conn){
    console.log("CONECTION!");
    conn.emit('connection', "Connexion creada");
    conn.on('username', function(data, callback){
        console.log("INSIDE CONN:ON 'USERNAME'");
        if(data in users){
            console.log("1");
            callback(false);
        }else if(data==null) {
            console.log("2");
            callback(false);
        }
        else{
            console.log("3");
            callback(true);
            conn.username=data;
            users[conn.username]=conn;
            console.log("USUARIO QUE SE CONECTA " + conn.username);
            conn.emit('listaUsers', Object.keys(users));
        }
    });

    conn.on('notification', function(data){
        var length;
        var us;
        console.log("PASO TODOS LAS NOTIFICACIONES");
        usuario.findOne({username: data}).exec(function(err,res){
            if(err){}
            else if (res==undefined){}
            else us=res.username;
        });
        notification.find({username: data, vist:false}).sort({date:-1}).exec(function(err, res){
            length = res.length;
        });
        notification.find({username: data}).sort({date:-1}).limit(5).exec(function(err, res){
            if(err) {}
            else if(res==[]){}
            else {
                if(us in users)
                    users[us].emit('notification', {numeros: length, notifications: res});}
        })
    });

    conn.on('follow', function(data){
        console.log("DENTRO DEL SOCKET PARA FOLLOW");
        usuario.findOne({username: data}).exec(function(err,res){
            console.log(res.username);
            if(err) conn.emit('err', "Error");
            else{
                if(data in users) {
                    console.log("ENVIO LA NOTIFICACION");
                    console.log("EL USUARIO AL Q SE LO ENVIA: " + data);
                    users[data].emit('new notification', res);
                }
                else console.log("IS NOT CONNECTED");
            }
        })
    });

    conn.on('disconnect', function(data){
        console.log("INSIDE DISCONNECT");
        console.log(conn.username);

        if(!conn.username) {
            console.log("no esta el conn");
            return;
        }
        delete users[conn.username];
        console.log("BORRADO");
        conn.emit('listaUsers', Object.keys(users));
    })
});

socket_server.listen(3000);
console.log("Conectados a traves de sockets por el puerto 3000");