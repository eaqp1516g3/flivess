/**
 * Created by Joe on 7/5/16.
 */

module.exports = function (app) {

    var mongoose = require('mongoose');
    var Track = require('../models/track.js');
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

    //endPoints
    app.get('/track',test);
    app.post('/addtrack',addTrack);
}