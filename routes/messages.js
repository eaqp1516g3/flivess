module.exports = function (app) {

    var User = require('../models/user.js');
    var Message = require('../models/message.js');
    //var Chat = require('../models/chat.js');


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
                var message = new Message({
                    reciver: req.body.reciver,
                    sender: req.body.sender,
                    subject: req.body.subject,
                    text: req.body.text,

                })

                message.save(function (err, message) {
                    if (err) return res.send(500, err.message);
                    res.status(200).jsonp(message);
                });

            }

        });

    };


    //GET - GET All Messages by Username
    findMessages = function (req, res) {
        console.log (req.params.username);
        Message.find({reciver: req.params.username}, function (err, message) {
            User.populate(message, {path: "sender"}, function (err, message) {
                res.status(200).send(message);
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

  app.delete('/message/:id', deleteMessage);
    //endpoints
    app.get('/allmessages', allMessages);
    app.post('/addmessage', addMessage);
    app.get('/messages/:username', findMessages);


}
