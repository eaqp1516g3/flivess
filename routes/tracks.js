/**
 * Created by Joe on 7/5/16.
 */

module.exports = function (app) {

    var mongoose = require('mongoose');
    var Track = require('../models/track.js');
    var Friend = require('../models/friend.js');
    var User = require('../models/user.js');

    var base_url = 'http://localhost:8080';
    //var base_url="http://147.83.7.157:8080";
    var fs = require('fs');
    var geolib = require('geolib');


    //Prueba de funcionamiento
    test = function(req,res){
        var path = './public/tracks/';
        var tracks_cercanos=[];
        var track_list;
        var j;
        var latitude_user = req.body.latitude;
        var longitude_user = req.body.longitude;
        var latitude;
        var longiude;
        console.log(req.body.latitude);
        console.log(req.body.latitude);
        var  getTracks = function(){
            Track.find({},function(err,tracks){
                track_list=tracks;
                //var files= tracks.pointsurl.split('/');
                console.log("CUANTOS TRACKS: "+tracks.length);
                for(i=0;i<track_list.length;i++){
                    j=i;
                    var url= track_list[i].pointsurl;
                    //console.log(url);
                    var files = url.split("/");
                    console.log(files);
                    fs.readFile(path+files[4],'utf8',function(err,data){
                        if (err) {
                            return console.log(err);
                        }
                        var points = JSON.parse(data);
                        latitude = points[0].latitude;
                        longiude = points[0].longitude;
                        //console.log(points[0]);
                        if(geolib.isPointInCircle(
                                {latitude: latitude_user, longitude: longitude_user},
                                {latitude: latitude, longitude: longiude},
                                30
                            )==true){
                            tracks_cercanos.push(track_list[j]);
                        }
                        //console.log(tracks_cercanos);
                    })

                }


            });

        }
        function testing(){
            console.log("YOUUUU");
            console.log(tracks_cercanos.length);
            res.send(tracks_cercanos);
        }
        getTracks();
        setTimeout(testing,3000);






        /*fs.readFile('test','utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            var points = JSON.parse(data);
            console.log(points[0]);
            res.send(points[0]);
        });*/

    }


    //genera un modelo de track con los parametros calculados en el cliente y un un fichero json con los puntos del track
    addTrack = function(req,res){
        var fs = require('fs');
        var path = './public/tracks/';
        if(req.body.id_comun==null){
            console.log("ESTA RUTA ES NUEVA")
            req.body.id_comun = Math.floor((Math.random() * 99999) + 1);
        }
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
            id_comun:req.body.id_comun,
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


   /* //Obtiene un track mediante ID
    getTrack = function(req,res){
        Track.findById(req.params.id, function (err, track) {
            if (err) return res.send(500, err.message);

            console.log('GET track by ID: ' + req.params.id);
            res.status(200).json(track);
        });

    }*/

    //Obtiene un track mediante ID
    getTrack = function(req,res){
        var ranking =[];
        var existe = false;
        Track.findById(req.params.id, function (err, track) {
            if (err) return res.send(500, err.message);

            console.log('GET track by ID: ' + req.params.id);
            //res.status(200).json(track);

            Track.find({id_comun:track.id_comun},function(err,tracks){
                console.log("BUSCO TRACKS CON ID COMUN");
                ranking.push(tracks[0]);
                for(i=1;i<tracks.length;i++){
                    for(j=0;j<ranking.length;j++) {
                        if (tracks[i].username == ranking[j].username) {
                            console.log("ESTA DENTRO DEL RANKING");
                            existe = true;
                            if (tracks[i].time < ranking[j].time) {
                                console.log("CAMBIO A UN TIEMPO MEJOR")
                                ranking[j] = tracks[i];
                            }
                        }
                    }
                    if(existe == false){
                        console.log("AÑADO AL RANKING");
                        ranking.push(tracks[i]);
                    }
                    existe = false;
                }
                console.log("FINISH!")
                var ranking_obj ={
                    track_pedido: track,
                    ranking: ranking,
                }
                res.send(ranking_obj);
            })
        });
        /* function testing(){
         console.log("YOUUUU");
         console.log(ranking.length);
         res.send(ranking);
         }
         setTimeout(testing,2000);*/
    }

    //Obtiene mis tracks
    tracksByUserName = function(req,res){
        Track.find({username:req.params.username}, function (err,tracks){
            if (err) return res.send(500, err.message);
            console.log("Obtengo tracks de: "+ req.params.username);
            res.status(200).json(tracks);
        })

    }

    numtracksByUserName = function(req,res){
        Track.find({username:req.params.username}, function (err,tracks){
            if (err) return res.send(500, err.message);
            console.log("Obtengo tracks de: "+ req.params.username);
            res.status(200).json(tracks.length);
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

    deleteTrack = function(req, res){
        Track.findOne({_id:req.params.id}, function(err,result){
            if(err) return res.send(500,err.message);
            console.log(result);
            result.remove(function(err){
                if (!err) {
                    console.log("track eliminado");
                    res.send("DELETED!")
                } else {
                    console.log(err);
                }
            });

        });
    }




    //endPoints
    app.post('/test',test);
    app.get('/track/:id',getTrack);
    app.get('/tracks/:username',tracksByUserName);
    app.get('/tracks/num/:username',numtracksByUserName);
    app.get('/tracks/friends/:username',getLastFriendsTracks);
    app.delete('/track/:id',deleteTrack);
    app.post('/addtrack',addTrack);
}