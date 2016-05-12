/**
 * Created by Joe on 7/5/16.
 */

module.exports = function (app) {

    var mongoose = require('mongoose');
    var Track = require('../models/track.js');
    var Friend = require('../models/friend.js');
    var User = require('../models/user.js');

    var base_url = 'http://localhost:8080';
    var fs = require('fs');


    //Prueba de funcionamiento
    test = function(req,res){
        fs.readFile('test','utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            var points = JSON.parse(data);
            console.log(points[0]);
            res.send(points[0]);
        });

    }


    //genera un modelo de track con los parametros calculados en el cliente y un un fichero json con los puntos del track
    addTrack = function(req,res){
        console.log(req.body);
        var fs = require('fs');
        var path = './public/tracks/';
        fs.writeFile(path + req.body.title+'.json',JSON.stringify(req.body.data),function(err){
            return console.log(err);
        })
        console.log('FICHERO GENERADO');
        var url = base_url+'/tracks/'+req.body.title+'.json';

        var track = new Track({
            title: req.body.title,
            username: req.body.username,
            avg_speed: req.body.avg_speed,
            distance: req.body.distance,
            time: req.body.time,
            pointsurl:url,
        })
        console.log(track);


        track.save(function (err, track) {
            if (err) {
                console.log('ERROR');
                console.log(err);
                return res.send(500, err.message);
            }

            res.status(200).json(track);

        });
    }


    //Obtiene un track mediante ID
    getTrack = function(req,res){
        Track.findById(req.params.id, function (err, track) {
            if (err) return res.send(500, err.message);

            console.log('GET track by ID: ' + req.params.id);
            res.status(200).json(track);
        });

    }

    //Obtiene mis tracks
    tracksByUserName = function(req,res){
        Track.find({username:req.params.username}, function (err,tracks){
            if (err) return res.send(500, err.message);
            console.log("Obtengo tracks de: "+ req.params.username);
            res.status(200).json(tracks);
        })

    }


    getLastFriendsTracks = function(req,res){



        Friend.find({username: req.params.username}).distinct("friend", function (err, friends) {
            console.log(friends);
            User.find({_id: {$in:friends }}).distinct("username", function(err,users){
                console.log("USUARIOS:"+users);
                Track.find({username: {$in:users }},function (err,result){
                        if (err) return res.send(500, err.message);
                        console.log(result);
                        res.status(200).send(result);
                });
            });
        });
    }




    //endPoints
    app.get('/track',test);
    app.get('/track/:id',getTrack);
    app.get('/tracks/:username',tracksByUserName);
    app.get('/tracks/friends/:username',getLastFriendsTracks);

    app.post('/addtrack',addTrack);
}