/**
 * Created by irkalla on 25.03.16.
 */
var App = angular.module('backoffice', []);



App.controller('boController', ['$scope', '$http', function($scope, $http) {



    $http.get('http://localhost:3000/user/56f517a1464df9b7636e0705').success(function(response){
        console.log("He obtenido lo que pedia");
        $scope.user = response;
        $scope.contact = "";
    });

    $scope.updateUser = function() {
        console.log($scope.user._id);
        $http.put('http://localhost:3000/user/' + $scope.user._id, $scope.user).success(function (response) {
            window.alert("Changes saved");
        })

    };

}]);