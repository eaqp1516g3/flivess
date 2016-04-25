/**
 * Created by irkalla on 14.04.16.
 */

angular.module('Flivess').controller('friendsCtl', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {
    var base_url_prod="http://localhost:3000"
    //var base_url_prod = "http://147.83.7.157:8080";


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

    $scope.remove = function (friend) {
        $http.delete('/friend/' + userLogged.username + "/" + friend).success(function () {
            refresh();
        });
    };

    $scope.profile = function (name) {
        $location.path('/profile/' + name);
    }

}]);