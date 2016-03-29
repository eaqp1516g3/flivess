
var App = angular.module('messages', ['ngCookies']);

var base_url_prod="http://147.83.7.157:8080"


App.controller('controller1', ['$scope', '$http','$cookies', function($scope, $http, $cookies) {

    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);

    var refresh = function() {
        $http.get(base_url_prod+ '/messages/' + userLogged.username).success(function (response) {


            console.log("Messages received");
            console.log(response);
            $scope.messages = response;
        });
    }
    refresh();

    $scope.sendMessage = function() {
        console.log("Before sending")
        console.log($scope.message);

        $scope.message.sender = userLogged.username;
        $http.post(base_url_prod+'/addmessage', $scope.message).success(function(response) {

            console.log($scope.message);
            console.log("Response");
            console.log(response);
            $scope.message="";
            refresh();
        });
    };
}]);