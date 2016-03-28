var base_url_prod="http://147.83.7.157:8080"
var App = angular.module('friends', []);



App.controller('controller1', ['$scope', '$http', function($scope, $http) {


    var refresh = function() {
        $http.get(base_url_prod+'/friends/carlos').success(function (response) {
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