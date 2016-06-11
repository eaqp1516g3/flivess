/**
 * Created by irkalla on 02.06.16.
 */
angular.module('Flivess').controller('followingListCtl',['$scope', '$http','$cookies', '$routeParams','SocketIoFactory','$mdDialog','$location','$q',function($scope, $http,$cookies,$routeParams,socket,$mdDialog,$location,$q) {

    var base_url="http://localhost:8080";
    //var base_url = "http://147.83.7.157:8080";

    var userLogged = $cookies.getObject('user');
    if(angular.isUndefined($cookies.getObject('user'))) $location.path('');

    $scope.userLogged = userLogged.username;
    console.log(userLogged);
    $scope.followingsof = $routeParams.username;


    var main = function(){
        var promises = [];
        $scope.buttons = [];

        console.log('GETTING FOLLOWING de '+$routeParams.username);

        $http.get(base_url + '/friends/' + $routeParams.username).success(function (data,callback) {
            console.log("primer GET");
            console.log(data);
            $scope.friends = data;

            angular.forEach(data, function(user, key) {
                console.log("EN EL FOREACH");

                var deffered  = $q.defer();

                $http.get(base_url+ '/friends/' + userLogged.username + "/" + user.friend.username).success(function (response) {
                    deffered.resolve(response);
                    //console.log('Are friends? '+userLogged.username+' ' + user.friend.username+' '+response);
                    //console.log('Response: '+response);
                    //var obj = response;
                    //console.log($scope.buttons.length);
                    //$scope.buttons.push(obj);
                    //return response;
                });

                promises.push(deffered.promise);

                //return $q.all(promises);


                console.log('Buttons:');
                console.log($scope.buttons);

            });
            console.log("PROMISES");
            console.log($q.all(promises));
            $q.all(promises).then(function(results){
                console.log("ALL");
                console.log(results);
                for(i=0;i<results.length;i++){
                    var obj = results[i];
                    //console.log($scope.buttons.length);
                    $scope.buttons.push(obj);
                    //return response;
                }
            });


            if($scope.friends == '')
                $scope.noFollowing = true;
            else $scope.noFollowing = false;
        }).error(function (data, status) {
            alert('get data error!');
        });


        console.log('finish');

    };

    main();



    $scope.follow = function (namee) {
        console.log('Seguir a: '+namee);
        console.log("Dentro de addFriend");
        var amigos = new Object();
        amigos.username = userLogged.username;
        console.log(userLogged.username);
        amigos.friend = namee;
        console.log(namee);
        console.log("Lo que envio " + amigos);

        $http.post(base_url+'/addfriend', amigos).success(function() {
            socket.emit('follow', amigos.friend);
            main();
        });
    }

    $scope.showConfirm = function(ev, username) {
        console.log('Dejar de seguir: '+username);
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Would you like to unfollow this user?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('YES')
            .cancel('NO');
        $mdDialog.show(confirm).then(function() {
            $http.delete(base_url+'/friend/' + userLogged.username + "/" + username).success(function () {
                main();
            });
        }, function() {
            console.log("EN LA OTRA FUNCION");
        });
    };


    $scope.profile = function (name) {
        $location.path('/profile/' + name);
    };





}]);