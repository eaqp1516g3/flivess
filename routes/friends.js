module.exports = function (app) {

    var Friend = require('../models/friend.js');
    var User = require('../models/user.js');
    var notification = require('../models/notification.js');


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

    isFriend = function(req,res) {
        console.log("isFRiend");
        User.findOne({username: req.params.friend}, function (err, data) {
            console.log(data._id);
            var id_friend = data._id;
            console.log(id_friend);
            Friend.findOne({username: req.params.username,friend: id_friend}, function(err,data){
                if(data==null){
                    res.send(false);
                }
                else res.send(true);
            });
        });
    }

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
                friend: id_friend
            });

            friend.save(function (err, friend) {
                if (err) return res.send(500, err.message);
                res.status(200).json(friend);
            });

            notification.findOne({username: req.body.friend, type: 1, actionusername: req.body.username}).exec(function(err,res){
                console.log('CREO LA NOTIFICACION');
                if(err) console.log("Falla");
                else if(res==undefined) {
                    var notify = new notification({
                        username: req.body.friend,
                        type: 1,
                        actionusername: req.body.username,
                        text: "is following you",
                        vist: false
                    });
                    notify.save(function (err) {
                        if (err)res.status(500).send('Internal server error');
                    })
                }
            })
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

    findFollowers = function (req,res) {
        User.findOne({username: req.params.username},function (err,user){
            if (err) return res.send(500, err.message);
            console.log(user);
            Friend.find({friend:user._id},function (err,followers){
                if (err) return res.send(500, err.message);
                console.log(followers);
                res.send(followers);
            });

        });

    }

    numFollowers = function (req,res) {
        User.findOne({username: req.params.username},function (err,user){
            if (err) return res.send(500, err.message);
            console.log(user);
            Friend.find({friend:user._id},function (err,followers){
                if (err) return res.send(500, err.message);
                console.log(followers);
                console.log(followers.length);
                res.status(200).json(followers.length);
            });

        });

    }

    numFollowing = function (req, res) {

        console.log ("joder");
        console.log (req.params.username);
        Friend.find({username: req.params.username}, function (err, friend) {
            res.status(200).json(friend.length);
            console.log(friend.length);

        });
    };

    
    //DELETE - Delete a User with specified ID
    deleteFriend = function (req, res) {

        User.findOne({username: req.params.friend}, function (err, data) {
            console.log(data._id);
            var id_friend = data._id;
            console.log(id_friend);

            Friend.findOne({username: req.params.username, friend:id_friend}, function (err, friend) {
                console.log('DELETE usuario');
                console.log(friend);
                friend.remove(function (err) {
                    if (!err) {
                        console.log("usuario eliminado");
                        return res.send('');
                    } else {
                        console.log(err);
                    }
                });

            });
        });
    }

    

    //endpoints
    app.get('/nfollowers/:username', numFollowers);
    app.get('/nfollowing/:username', numFollowing);
    app.get('/allfriends', allFriends);
    app.get('/friends/:username', findFriends);
    app.get('/friends/:username/:friend',isFriend);
    app.get('/friends/friend/:username/followers',findFollowers);
    app.post('/addfriend', addFriend);
    app.delete('/friend/:username/:friend', deleteFriend);

}
