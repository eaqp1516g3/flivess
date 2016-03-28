
var App = angular.module('friends', []);



App.controller('controller1', ['$scope', '$http', function($scope, $http) {


    var refresh = function() {
        $http.get('http://localhost:3000/friends/carlos').success(function (response) {
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