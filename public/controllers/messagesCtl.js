/**
 * Created by irkalla on 14.04.16.
 */


angular.module('Flivess').controller('messagesCtl', ['$scope', '$http','$cookies', '$location', function($scope, $http, $cookies, $location) {

    var base_url_prod="http://localhost:8080"
    //var base_url_prod = "http://147.83.7.157:8080";


    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);

    var refresh = function() {
        $http.get(base_url_prod+ '/messages/' + userLogged.username).success(function (response) {
            console.log(response);
            $scope.users = response;
        });
    }
    refresh();

    $scope.conversacion = function (user) {
        $http.get(base_url_prod+ '/messages/' + userLogged.username +'/' + user).success(function (response) {
            $scope.conv = true;
            console.log("Messages received");
            console.log(response);
            $scope.usuarioC = user;
            $scope.msgs = response;
        });
    }



    $scope.sendMessage = function(receiver) {
        console.log("Before sending")
        console.log($scope.message);

        $scope.message.sender = userLogged.username;
        $scope.message.receiver = receiver;
        $http.post(base_url_prod+'/addmessage', $scope.message).success(function(response) {

            console.log($scope.message);
            console.log("Response");
            console.log(response);
            $scope.message="";

            $http.get(base_url_prod+ '/messages/' + userLogged.username +'/' + receiver).success(function (response) {
                $scope.msgs = response;
            });
        });
    };

    $scope.profile = function (name) {
        $location.path('/profile/' + name);
    }

}]);