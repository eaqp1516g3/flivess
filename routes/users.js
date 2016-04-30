module.exports = function (app) {
    var mongoose = require('mongoose');
    var User = require('../models/user.js');

    //GET - GET All Users By Into DB
    AllUsers = function (req, res) {
        User.find(function (err, users) {
            if (err) res.send(500, err.message);

            console.log('GET /users')
            res.status(200).json(users);
        });
    };

    //GET - GET All Users With Friends
    AllUsersWithFriends = function (req, res) {
        User.find({})
               .populate('friend')
               .exec(function(error, users) {
                console.log(JSON.stringify(users, null, "\t"));
               })

    };

    //GET - Return a User with specified ID
    findById = function (req, res) {
        User.findById(req.params.id, function (err, users) {
            if (err) return res.send(500, err.message);

            console.log('GET /user/' + req.params.id);
            res.status(200).json(users);
        });
    };

    //GET - Return a user with a specified name
    findbyName = function (req,res) {
        User.find({username:req.params.username}, function (err,user){
            if (err) return res.send(500, err.message);
            console.log("busco a"+ req.params.username);
            res.status(200).json(user);
        })
    }

    //GET - Return a user with a specified facebook_id
    findbyFacebookid = function (req,res) {
        User.find({facebook_id: req.params.facebook_id}, function (err,user){
            if (err) return res.send(500, err.message);
            console.log("busco a"+ req.params.facebook_id);
            res.status(200).json(user);
        })
    }

    //POST - Add User 
        addUser = function (req, res) {
        console.log('POST');
        console.log(req.body);
        result = res;
        request = req;

        var u = [];
        var u1;
        var u2;


       var username = req.body.username;

        
        User.find({username: username}, function (err, user) {
            console.log (user);


            if (user == "") {
                u1 = '"' + req.body.username + '"';
                console.log(u1 + u2 );
                checkregister(u1, u2);
            }
            else {
                var user = JSON.stringify(user);
                var res = user.split(",");
                console.log("aqui el res esta con el split"+res);

                u = res[1].split(":");
                u2 = u[1];
                u1 = '"' + req.body.username + '"';
                checkregister(u1, u2);
            }
            

        });

    };

    function checkregister(u1, u2) {

        if (u1 == u2) {
            return result.status(409).json("usuario " + u1 + " ya existe");
        }
        else {
            console.log("he comprobado que no existe")
                var users = new User({
                    username: request.body.username,
                    fullname: request.body.fullname,
                    email: request.body.email,
                    password: request.body.password,
                    level: 0,
                    age: request.body.age,
                    sex:request.body.sex,
                    weight:request.body.weight,
                    height:request.body.height,
                    facebook_id:'',
                    token:'',
                })
            console.log(users);

            users.save(function (err, users) {
                if (err) {
                    console.log('ERROR');
                    console.log(err);
                    return result.send(500, err.message);
                }

                result.status(200).json(users);

            });
        }
    };



    //PUT - Update a register already exists
    updateUser = function (req, res) {
        User.findById(req.params.id, function (err, users) {
            console.log('PUT');
            console.log(req.params.id);
            console.log(req.body);
        

            users.username = req.body.username;
            users.fullname = req.body.fullname;
            users.email = req.body.email;
            users.password = req.body.password;
            users.level= req.body.level;
            users.age = req.body.age;
            users.sex = req.body.sex;
            users.weight = req.body.weight;
            users.height = req.body.height;

            users.save(function (err) {
                if (err) return res.send(500, err.message);
                res.status(200).json(users);
            });
        });
    };


    //DELETE - Delete a User with specified ID
    deleteUser = function (req, res) {
        return User.findOne(req.params.username, function (err, users) {
            console.log('DELETE usuario');
            return users.remove(function (err) {
                if (!err) {
                    console.log("usuario eliminado");
                    return res.send('');
                } else {
                    console.log(err);
                }
            });
        });
    }

    //endpoints
    app.get('/allusers/',AllUsers);
    app.post('/user/', addUser);
    app.get('/user/:id', findById);
    app.get('/users/user/:username',findbyName);
    app.get('/users/user/facebook/:facebook_id',findbyFacebookid);
    app.put('/user/:id', updateUser);
    app.delete('/user/:username', deleteUser);
}
