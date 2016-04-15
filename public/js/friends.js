
var App = angular.module('friends', ['ngCookies']);

var base_url_prod="http://localhost:3000"




App.controller('controller1', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {

    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);

    var refresh = function() {

        $http.get(base_url_prod + '/friends/' + userLogged.username).success(function (response) {

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