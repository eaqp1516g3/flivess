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
var users=[];

io.on('connection', function(conn){
    console.log("CONECTION!");
    conn.emit('connection', "Connexion creada");

    conn.on('username', function(data, callback) {
        console.log("INSIDE CONN:ON 'USERNAME'");
        if (data == null) {
            console.log("2");
            callback(false);
        }

        else {
            var exit = false;
            for (var i = 0; i < users.length; i++) {
                if (users[i].username == data) {
                    users[i].ws.push(conn);
                    console.log("1");
                    var usuarios = [];
                    for (var i = 0; i < users.length; i++) {
                        usuarios.push(users[i].username);
                    }
                    conn.emit('listaUsers', usuarios);
                    callback(false);
                    exit= true;
                }
            }

            if(exit!=true) {
                console.log("3");
                callback(true);
                var user = {};
                user.username = data;
                user.ws = [];
                user.ws.push(conn);
                users.push(user);
                console.log(users[0].username);
                console.log("USUARIO QUE SE CONECTA " + user.username);
                var usuarios = [];
                for (var i = 0; i < users.length; i++) {
                    usuarios.push(users[i].username);
                }
                conn.emit('listaUsers', usuarios);
            }
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
                for (var i = 0; i < users.length; i++) {
                    if (users[i].username == data) {
                        for (var a = 0; a < users[i].ws.length; a++) {
                            users[i].ws[a].emit('notification', {numeros: length, notifications: res})
                        }
                    }
                }
            }
        })
    });

    conn.on('follow', function(data){
        console.log("DENTRO DEL SOCKET PARA FOLLOW");
        usuario.findOne({username: data}).exec(function(err,res){
            console.log(res.username);
            if(err) conn.emit('err', "Error");
            else{
                for (var i = 0; i < users.length; i++) {
                    if (users[i].username == data) {
                        for (var a = 0; a < users[i].ws.length; a++) {
                            users[i].ws[a].emit('new notification', res);
                        }
                    }
                }
            }
        })
    });

    conn.on('message', function(data){
        console.log("DENTRO DEL SOCKET PARA MESSAGE");
        usuario.findOne({username: data}).exec(function(err,res){
            console.log(res.username);
            if(err) conn.emit('err', "Error");
            else{
                for (var i = 0; i < users.length; i++) {
                    if (users[i].username == data) {
                        for (var a = 0; a < users[i].ws.length; a++) {
                            users[i].ws[a].emit('new notification', res);
                            users[i].ws[a].emit('chat');
                        }
                    }
                }
            }
        })
    });

    /*conn.on('track', function(data){ 
    usuario.findOne({username : data}), function(err, result) {
        follow.find({friend: result._id}).exec(function (err, res) {
            if (err) {
            }
            else {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].username in users) {
                        users[res[i].username].emit('new notification', res);
                    }
                }
            }
        })
    }})*/

    conn.on('disconnect', function() {
        console.log("INSIDE DISCONNECT");
        console.log(users);
        for (var i = 0; i < users.length; i++) {
            console.log("8");
            for (var a = 0; a < users[i].ws.length; a++) {

                if (users[i].ws[a] == conn) {
                    console.log("7");
                    console.log(users[i].ws);
                    console.log("ESTA EN BORRAR EL WS EN POSICION:" + a);
                    console.log("LENGTH= " + users[i].ws.length);
                    users[i].ws.splice(a,1);
                    //delete users[i].ws[a];
                    console.log("LENGTH= " + users[i].ws.length);
                    console.log(users[i].ws);
                    console.log(users);
                    if(users[i].ws==""){
                        console.log("A BORRAR PAYOO");
                        users.splice(i,1);
                    }
                    console.log(users);
                }
            }
        }
    })

});

socket_server.listen(3000);
console.log("Conectados a traves de sockets por el puerto 3000");