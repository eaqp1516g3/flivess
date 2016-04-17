module.exports = function (app) {

    var Friend = require('../models/friend.js');
    var User = require('../models/user.js');



    //GET- GET ALL Friends by Username
    allFriends = function (req, res) {

        console.log("ok populate");
        Friend.find({}, function(err, friend) {

             console.log("ok populate");
             console.log(friend);
            User.populate(friend, {path: "friend"},function(err, friend){
            res.status(200).send(friend);

            console.log(friend);
            }); 
         });

    };

    //POST - Add Friends
    addFriend = function (req, res) {
        console.log('POST');
        console.log(req.body);
        console.log(req.body.username);
        console.log(req.body.friend);
        console.log('test');
        User.findOne({username: req.body.friend}, function (err, data) {
            console.log(data._id);
            var id_friend = data._id;
            console.log(id_friend);

            var friend = new Friend({
                username: req.body.username,
                friend: id_friend,

            });

            friend.save(function (err, friend) {
                if (err) return res.send(500, err.message);
                res.status(200).json(friend);
            });
        });


    };
    //GET- GET ALL Friends by Username
    findFriends = function (req, res) {

        console.log ("joder");
        console.log (req.params.username);
        Friend.find({username: req.params.username}, function (err, friend) {
            User.populate(friend, {path: "friend"}, function (err, friend) {
                res.status(200).send(friend);
                console.log(friend);
            });
        });
    };

    
    //DELETE - Delete a User with specified ID
    deleteFriend = function (req, res) {
        return Friend.findById(req.params.id, function (err, friend) {
            console.log('DELETE usuario');
            return friend.remove(function (err) {
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
    app.get('/allfriends', allFriends);
    app.get('/friends/:username', findFriends);
    app.post('/addfriend', addFriend);
    app.delete('/friend/:id', deleteFriend);

}
