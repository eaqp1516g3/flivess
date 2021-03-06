/**
 * Created by aitor on 19/4/16.
 */
angular.module('Flivess').controller('profileCtl', ['$scope','$q', '$http', '$cookies', 'ModalService', '$routeParams', 'SocketIoFactory','$location', function($scope,$q, $http, $cookies, ModalService, $routeParams, socket, $location, $mdDialog) {
    //var base_url_prod="http://localhost:8080";
    var base_url_prod = "http://147.83.7.157:8080";


    console.log("DENTRO DE CONTROLOADOR de profile.html");
    var userLogged = $cookies.getObject('user');
    if(angular.isUndefined($cookies.getObject('user'))) $location.path('');

    $scope.userlogged = userLogged;
    console.log(userLogged.username);
    var friend= new Object();

    var getOwnProfile = function(){

        $http.get(base_url_prod + '/users/user/' + userLogged.username).success(function (response) {
        console.log("Get own profile");
            console.log("Entro");
            console.log(response[0]);
            $scope.friend = response[0];
            if(!angular.isUndefined($scope.friend.weight)){
                $scope.friend.weight= $scope.friend.weight+' Kg';
            }
            if(!angular.isUndefined($scope.friend.height)){
                $scope.friend.height=$scope.friend.height+' cm';
            }

        });

    }


    var refresh = function() {
        console.log("USER: " +userLogged.username + " FRIEND: " + $routeParams.friend);
        if (userLogged.username==$routeParams.friend || $routeParams.friend=="miperfil"){
            $scope.myprofile=false;
            console.log("MY PROFILE:" + $scope.myprofile);
            getOwnProfile();
            console.log("Esto se guarda: " + $scope.friend);
        }
        else {
            $scope.myprofile=true;
            console.log("MY PROFILE:" + $scope.myprofile);
            $http.get(base_url_prod + '/users/user/' + $routeParams.friend).success(function (response) {

                friend = response[0];
                $scope.friend = friend;
                if(!angular.isUndefined($scope.friend.weight)){
                    $scope.friend.weight= $scope.friend.weight+' Kg';
                }
                if(!angular.isUndefined($scope.friend.height)){
                    $scope.friend.height=$scope.friend.height+' cm';
                }
                isFriend();
            });
        }
    };

    refresh();


    $scope.addFriend = function () {
        console.log("Dentro de addFriend");
        var amigos = new Object();
        amigos.username = userLogged.username;
        amigos.friend = friend.username;
        $http.post(base_url_prod+'/addfriend', amigos).success(function(response) {
            socket.emit('follow',friend.username);
            isFriend();
            $scope.loadInfo();
        });
    }

    $scope.loadInfo = function () {
        $http.get(base_url_prod + '/tracks/num/' + $routeParams.friend ).success(function (response) {

            $scope.ntracks = response;
        });
        $http.get(base_url_prod + '/nfollowing/' + $routeParams.friend ).success(function (response) {

            $scope.nfollowing = response;
        });
        $http.get(base_url_prod + '/nfollowers/' + $routeParams.friend ).success(function (response) {

            $scope.nfollowers = response;
        });

    }

    $scope.loadInfo();

    $scope.removeFriend = function () {
        $http.delete(base_url_prod+'/friend/' + userLogged.username + "/" + friend.username).success(function () {
            isFriend();
            $scope.loadInfo();
        });
    };

    $scope.showModel = function() {

        ModalService.showModal({
            templateUrl: "/views/modalMessage.html",
            controller: "modalMessageCtl",
            backdrop: true,
            inputs: {
                friend: friend.fullname
            }
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if(result.message!=null){
                    sendMessage(result.message);
                }
            });
        });

    };

    var sendMessage = function (msg) {
        var message = new Object();
        message.text = msg;
        message.sender = userLogged.username;
        message.receiver = friend.username;
        $http.post(base_url_prod+'/addmessage', message).success(function() {
            socket.emit('message', friend.username);
        });
    };


    var isFriend = function () {
        $http.get(base_url_prod+ '/friends/' + userLogged.username + "/" + friend.username).success(function (response) {
            console.log(response);
            if(response==true){
                $scope.show=false;
                console.log("EL SHOW:" + $scope.show);
            }
            else{
                $scope.show=true;
                console.log("EL SHOW:" + $scope.show);
            }

        });
    };

    $scope.followinglist = function (friend) {
        $location.path('/followinglist/' + friend);
    };

    $scope.followerslist = function (friend) {
        $location.path('/followerslist/' + friend);
    };


    $scope.showConfirm = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Would you like to delete your debt?')
            .textContent('All of the banks have agreed to forgive you your debts.')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Please do it!')
            .cancel('Sounds like a scam');
        $mdDialog.show(confirm).then(function() {
            $scope.status = 'You decided to get rid of your debt.';
        }, function() {
            $scope.status = 'You decided to keep your debt.';
        });
    };

    var main = function(){
        var promises=[];
        console.log("estoy en el main");
        $http.get(base_url_prod + '/tracks/' + $routeParams.friend).success(function(data){
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
                    data[int].img="http://maps.googleapis.com/maps/api/staticmap?center="+data[int].center+"&zoom=17scale=1&size=425x180&maptype=roadmap&path=color:0xff0000ff|weight:3|"+data[int].path +"&sensor=false&markers=color:blue%7Clabel:S%7C"+marker1+"&markers=color:red%7Clabel:F%7C"+marker2;
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