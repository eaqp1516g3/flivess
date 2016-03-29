
var App = angular.module('friends', ['ngCookies']);



App.controller('controller1', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {

    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);

    var refresh = function() {
        $http.get('http://localhost:3000/friends/' + userLogged.username).success(function (response) {
        //$http.get('http://localhost:3000/friends/Aitor').success(function (response) {
            console.log("Acabo de recibir los amigos");
            console.log(response);
            $scope.friends = response;
            
        });
    }
    refresh();

    $scope.remove = function (id) {
        console.log(id);
        $http.delete('/friend/' + id).success(function () {
            refresh();
        });
    };

}]);