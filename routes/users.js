module.exports = function (app) {
    var mongoose = require('mongoose');
    var User = require('../models/user.js');

// app.post('/contactList', function(req,res){
//  console.log(req.body);
//  db.contactList.insert(req.body, function (err, doc){
//      res.json(doc);
//  });

// });


    //GET - GET All Users By Into DB
    AllUsers = function (req, res) {
        User.find(function (err, users) {
            if (err) res.send(500, err.message);

            console.log('GET /users')
            res.status(200).jsonp(users);
        });
    };

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
            res.status(200).jsonp(users);
        });
    };

    //POST - Add User in DB
    addUser = function (req, res) {
        console.log('POST');
        console.log(req.body);


          var users = new User({
                    username: req.body.username,
                    fullname: req.body.fullname,
                    email: req.body.email,
                    level: req.body.level,
                    ege: req.body.ege,
                    sex:req.body.sex,
                    weight:req.body.weight,
                    height:req.body.height,
                })

            users.save(function (err, users) {
                if (err) return res.send(500, err.message);
                res.status(200).jsonp(users);

            });
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
            users.level= req.body.level;
            users.ege = req.body.ege;
            users.sex = req.body.sex;
            users.weight = req.body.weight;
            users.height = req.body.height;

            users.save(function (err) {
                if (err) return res.send(500, err.message);
                res.status(200).jsonp(users);
            });
        });
    };


    //DELETE - Delete a User with specified ID
    deleteUser = function (req, res) {
        return User.findById(req.params.id, function (err, users) {
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
    app.put('/user/:id', updateUser);
    app.delete('/user/:id', deleteUser);
}
