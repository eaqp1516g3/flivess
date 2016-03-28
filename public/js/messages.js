var base_url_prod="http://147.83.7.157:8080"
var App = angular.module('messages', []);



App.controller('controller1', ['$scope', '$http', function($scope, $http) {


    var refresh = function() {
        $http.get(base_url_prod+'/messages/carlos').success(function (response) {
            console.log("Acabo de recibir los msg");
            console.log(response);
            $scope.messages = response;
        });
    }
    refresh();

    $scope.sendMessage = function() {
        console.log("ANTES DE ENVIARLO AL SERVIDOR;")
        console.log($scope.message);
        $http.post(base_url_prod+'/addmessage', $scope.message).success(function(response) {
            console.log($scope.message);
            console.log("RESPUESTA");
            console.log(response);
            $scope.message="";
            refresh();
        });
    };
}]);