/**
 * Created by irkalla on 14.04.16.
 */



angular.module('Flivess').controller('homeCtl', ['$scope', '$http', '$cookies', '$rootScope', '$location','$q', function($scope, $http, $cookies, $rootScope, $location,$q) {
    //var base_url_prod="http://localhost:8080";
    var base_url_prod = "http://147.83.7.157:8080";
    var userLogged = $cookies.getObject('user');
    if(angular.isUndefined($cookies.getObject('user'))) $location.path('');
    else {
        console.log("EL USERNAME: " + userLogged.username);
        $rootScope.isLogged = true;
        $scope.noFollowing = false;
    }

    var main = function(){
        var promises=[];
        console.log("estoy en el main");
        $http.get(base_url_prod + '/tracks/friends/' + userLogged.username).success(function(data){
           console.log("PRIMER GET");

           console.log(data);
             if(data=="") {
                 console.log("DENTRO DEL NO FOLLOWING");
                 $scope.noFollowing = true;
             }
            angular.forEach(data,function(d){
                //console.log("EN EL FOREACH");
                //console.log(d.pointsurl);
                var deffered  = $q.defer();
                $http.get(d.pointsurl).success(function(datos){
                    //console.log("GET");
                    deffered.resolve(datos);
                    console.log(deffered.promise);

                });
                //console.log("PUSH");
                promises.push(deffered.promise);
                console.log(promises);
            });
            console.log("PROMISES");
            console.log($q.all(promises));
            $q.all(promises).then(function(results){
                console.log("ALL");
                console.log(results);
                console.log(data);
                var int=0;
                for (var i = 0; i < data.length; i++) {

                    var final_time_m = Math.floor(data[i].time / 60);
                    var final_time_s = Math.floor(data[i].time - (final_time_m * 60));
                    data[i].time =final_time_m+' min '+final_time_s+' s';

                    if(data[i].distance<1) data[i].distance=data[i].distance * 1000 + ' m';
                    else data[i].distance=data[i].distance + ' Km';

                    if (data[i].avg_speed>0) data[i].avg_speed= Math.floor(60/(data[i].avg_speed)).toFixed(2);

                    for (var a = 0; a < results[i].length; a++) {
                        if (a == 0) data[int].path = results[i][a].latitude + "," + results[i][a].longitude;
                        else data[int].path += "|" + results[i][a].latitude + "," + results[i][a].longitude;
                    }
                    data[int].center = results[i][1].latitude + "," + results[i][1].longitude;
                    var marker1 = results[i][0].latitude + "," + results[i][0].longitude;
                    var marker2 = results[i][results[i].length -1].latitude + "," + results[i][results[i].length -1].longitude;

                    //strokeColor: "#FF0000",
                    //strokeOpacity: 0.7,
                    //strokeWeight: 3
                    data[int].img="http://maps.googleapis.com/maps/api/staticmap?center="+data[int].center+"&zoom=17scale=1&size=470x180&maptype=roadmap&path=color:0xff0000ff|weight:3|"+data[int].path +"&sensor=false&markers=color:blue%7Clabel:S%7C"+marker1+"&markers=color:red%7Clabel:F%7C"+marker2;
                    //zoom:17
                    //mapTypeId: google.maps.MapTypeId.ROADMAP
                    int++;


                }
                console.log("FINSIH");
                $scope.routes = data;
                console.log(data);
            });
        });


    };
    main();
}]);