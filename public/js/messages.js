var App = angular.module('messages', []);



App.controller('controller1', ['$scope', '$http', function($scope, $http) {


    var refresh = function() {
        $http.get('http://localhost:3000/messages/Erik').success(function (response) {
            console.log("Acabo de recibir los msg");
            console.log(response);
            $scope.messages = response;
        });
    }
    refresh();

    $scope.sendMessage = function() {
        console.log("ANTES DE ENVIARLO AL SERVIDOR;")
        console.log($scope.message);
        $http.post('http://localhost:3000/addmessage', $scope.message).success(function(response) {
            console.log($scope.message);
            console.log("RESPUESTA");
            console.log(response);
            refresh();
        });
    };
}]);