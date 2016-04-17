module.exports = function (app) {

    var User = require('../models/user.js');
    var Message = require('../models/message.js');

    getMessagesByUser = function(req,res) {

        var id_sender="";
        var id_user="";

        console.log("getuserbymessage\n");
        console.log(req.params.username);
        console.log(req.params.sender);
        User.findOne({username: req.params.sender}, function (err, data) {
            console.log(data._id);
            id_sender = data._id;
            User.findOne({username: req.params.username}, function (err, data2) {
                console.log(data2._id);
                id_user = data2._id;

            console.log("IDS GET");
            Message.find({$or:[{receiver: req.params.username,sender: id_sender},{receiver: req.params.sender,sender: id_user}]},function(err,message){
                console.log(message);
                User.populate(message,{path:"sender"},function(err,m){
                    res.status(200).send(message);
                });

            });
            });
        });



    };
    

    //GET - GET all messages
    allMessages = function (req, res) {

        console.log("ok populate");
        Message.find({}, function(err, message) {

             console.log("ok populate");
             console.log(message);
            User.populate(message, {path: "sender"},function(err, message){
            res.status(200).send(message);

            console.log(message);
            }); 
         });
    };


    //POST - POST Message By User
    addMessage = function (req, res) {
        console.log('POST');
        console.log(req.body);
        User.findOne({username: req.body.username}, function (err) {
            if (err) {
                res.send(401, err.message);
            }

            
            else {

                User.findOne({username: req.body.sender}, function (err, data) {
                    console.log(data._id);
                    var id_sender= data._id;
                    console.log(id_sender);
                

                
                    var message = new Message({
                        receiver: req.body.receiver,
                        sender: id_sender,
                        text: req.body.text,

                    })

                    message.save(function (err, message) {
                        if (err) return res.send(500, err.message);
                        res.status(200).json(message);
                    });


                });

            }

        });

    };

    //GET - get users that wrotes a determinate user
    findMessages = function (req, res) {
        console.log (req.params.username);
        Message.find({receiver: req.params.username}).distinct("sender", function (err, message) {
             User.find({_id: {$in: message}}, function (err, m) {
                res.status(200).send(m);
                console.log(m);
            });
        });
    };


    
    //DELETE - Delete a User with specified ID
    deleteMessage = function (req, res) {
        return Message.findById(req.params.id, function (err, message) {
            console.log('DELETE usuario');
            return message.remove(function (err) {
                if (!err) {
                    console.log("usuario eliminado");
                    return res.send('');
                } else {
                    console.log(err);
                }
            });
        });
    };

  
    //Endpoints
    app.get('/allmessages', allMessages);
    app.get('/messages/:username/:sender',getMessagesByUser);
    app.post('/addmessage', addMessage);
    app.get('/messages/:username', findMessages);
    app.delete('/message/:id', deleteMessage);


}
