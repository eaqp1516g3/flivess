var App = angular.module('messages', ['ngCookies']);


App.controller('controller1', ['$scope', '$http','$cookies', function($scope, $http, $cookies) {

    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);

    var refresh = function() {
        $http.get('http://localhost:3000/messages/' + userLogged.username).success(function (response) {
            console.log("Acabo de recibir los msg");
            console.log(response);
            $scope.messages = response;
        });
    }
    refresh();

    $scope.sendMessage = function() {
        console.log("Before sending")
        console.log($scope.message);
        $scope.message.sender = userLogged.username;
        $http.post('http://localhost:3000/addmessage', $scope.message).success(function(response) {
            console.log($scope.message);
            console.log("Response");
            console.log(response);
            refresh();
        });
    };
}]);