/**
 * Created by Joe on 16/4/16.
 */
module.exports = function (app) {
    var mongoose = require('mongoose');
    var User = require('../models/user.js');
    var Hash = require('jshashes');

    //POST
    login =function(req,res){
        var pass = req.body.password;
        var passhash = new Hash.SHA256(pass).hex(pass);
        User.findOne({username: req.body.username, password: passhash}, function(err,user){
            console.log(user);
            if(user==null) return res.status(404).send("INCORRECTO");
            else {
                console.log(user);
                return res.status(200).send(user);
            }
        });
    };


    //ENPOINTS
    app.post('/login',login);
}