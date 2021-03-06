/**
 * Created by Joe on 7/5/16.
 */

module.exports = function (app) {

    var mongoose = require('mongoose');
    var Track = require('../models/track.js');
    var Friend = require('../models/friend.js');
    var User = require('../models/user.js');
    //var base_url = 'http://10.183.45.57:8080';
    var base_url="http://147.83.7.157:8080";
    var fs = require('fs');
    var geolib = require('geolib');


    //Comprueba rutas cercanas dado un Radio RANGE
    test = function(req,res){
        var path = './public/tracks/';
        var tracks_cercanos=[];
        var filesync=[];
        var tracks_final=[];
        var track_list;
        var latitude_user = req.body.latitude;
        var longitude_user = req.body.longitude;
        var range = req.body.range;
        var latitude;
        var longiude;
        console.log(req.body.latitude);
        console.log(req.body.longitude);
        console.log(req.body.range);

        //console.log(req.body.range);

        onlyOneForId = function(arrtracks){
            console.log("DENTRO DE LA FUNCION!")
            console.log("RECIBO "+arrtracks.length+" TRACKS");
            var tracks =[];
            var existe = false;
            tracks.push(arrtracks[0]);
            console.log(tracks);
            for(i=1;i<arrtracks.length;i++){
                for(j=0;j<tracks.length;j++){
                    if(arrtracks[i].id_comun==tracks[j].id_comun){
                        existe=true;
                        console.log("YA HAY UNO");
                    }
                }
                if(existe == false){
                    console.log("AÑADO AL ARRAY");
                    tracks.push(arrtracks[i]);
                }
                existe = false;
            }
            return tracks;
        }

            Track.find({}, function (err, tracks) {
                    console.log(tracks);
                    console.log('prueba!');
                    track_list = tracks;
                    console.log(" numero de tracks: "+track_list.length);
                    for (i = 0; i < track_list.length; i++) {
                        var url = track_list[i].pointsurl;
                        var files = url.split("/");
                        console.log("PUNTOS");
                        filesync[i] = fs.readFileSync(path + files[4], 'utf8');
                        var points = JSON.parse(filesync[i]);
                        latitude = points[0].latitude;
                        longiude = points[0].longitude;
                        console.log(latitude + ' ' + longiude);
                        if (geolib.isPointInCircle(
                                {latitude: latitude_user, longitude: longitude_user},
                                {latitude: latitude, longitude: longiude},
                                range
                            ) == true) {
                            console.log('esta cerca!');
                            tracks_cercanos.push(track_list[i]);
                        }
                    }
                    console.log(tracks_cercanos);
                    tracks_final = onlyOneForId(tracks_cercanos);
                    console.log(tracks_final);
                    res.send(tracks_final);
                    console.log('FINISH');

            });
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
        var recorrido = parseFloat(req.body.distance);
        console.log("RECORRIDO: "+recorrido);

        var track = new Track({
            title: req.body.title,
            username: req.body.username,
            avg_speed: req.body.avg_speed,
            distance: req.body.distance,
            time: req.body.time,
            pointsurl:url,
            id_comun:req.body.id_comun
        })
        console.log(track);
        console.log("YOU");

        track.save(function (err, track) {
            if (err) {
                console.log('ERROR');
                console.log(err);
                return res.send(500, err.message);
            }

            User.findOne({username : req.body.username}, function(err, result) {
                console.log("KM ANTES: "+result.km_cycled);
                result.km_cycled = result.km_cycled + recorrido;
                console.log("KM DESPUES: "+result.km_cycled);
                result.save(function(err) {
                    if (err)res.status(500).send('Internal server error');
                })

                Friend.find({friend: result._id}).exec(function (err, res) {
                    if (err) {
                    }
                    else {
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].username in users) {
                                console.log('CREO LA NOTIFICACION');
                                var notify = new notification({
                                    username: res[i].username,
                                    type: 2,
                                    actionusername: req.body.username,
                                    text: "has been running",
                                    vist: false
                                });
                                notify.save(function (err) {
                                    if (err)res.status(500).send('Internal server error');
                                })
                            }
                        }
                    }
                })
            });

            res.status(200).json(track);
            console.log("YOU2");


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

    isSame = function(req,res){

        var path = './public/tracks/';
        var url = req.body.ruta_org;
        console.log('Url:');
        console.log(url);
        var files = url.split("/");
        console.log(req.body.ruta_org);
        var ruta_or = fs.readFileSync(path + files[4], 'utf8');
        console.log('Ruta:');
        var ruta_org = JSON.parse(ruta_or);
        console.log(ruta_org[0]);
        var ruta2 = req.body.ruta2;
        var dist_org = parseFloat(req.body.dist_org);
        var dist_ruta2 = parseFloat(req.body.dist_ruta2);
        var result=[];
        var same=0;
        var existe=false;
        console.log("RUTA ORIGINAL: "+ruta_org.length);
        console.log("RUTA TEST: "+ruta2.length);
        console.log("DISTANCIA ORIGINAL: "+dist_org);
        console.log("DISTANCIA TEST: "+dist_ruta2);
        if(dist_ruta2 >= dist_org-0.5 && dist_ruta2 <= dist_org+0.5){
            console.log("WUT");
            for(var i=0;i<ruta2.length;i++) {
                console.log("primer for");
                existe = false;
                for(j=0;j<ruta_org.length;j++) {
                    console.log("segundo for");
                    if (existe == false) {
                        console.log("existe es falso!");
                        existe = geolib.isPointInCircle(
                            {latitude: ruta_org[j].latitude, longitude: ruta_org[j].longitude},
                            {latitude: ruta2[i].latitude, longitude: ruta2[i].longitude},
                            10);
                        if (existe == true) {
                            console.log("posicion: " + i);
                            result.push('ok');
                        }
                    }
                    else {
                        console.log("NADA");
                    }
                }
            }
            console.log("WTF!?");
            same =(result.length/ruta2.length);
            console.log("SIMILITUD: "+same);
            if(same>=0.8){
                console.log("se parecen");
                res.send(true);
            }
            else {
                console.log('no se parecen');
                res.send(false);
            }
            //res.send(result.length + " PUNTOS EN COMUN DE "+ruta2.length+" PUNTOS POSIBLES");
        }
        else res.send(false);
    };





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

    };

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
    app.post('/tracks/compare/isSame',isSame);
    app.get('/track/:id',getTrack);
    app.get('/tracks/:username',tracksByUserName);
    app.get('/tracks/num/:username',numtracksByUserName);
    app.get('/tracks/friends/:username',getLastFriendsTracks);
    app.delete('/track/:id',deleteTrack);
    app.post('/addtrack',addTrack);

};