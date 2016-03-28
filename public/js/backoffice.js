/**
 * Created by irkalla on 25.03.16.
 */
var App = angular.module('backoffice', []);


App.controller('boController', ['$scope', '$http', function($scope, $http) {



    $http.get('http://localhost:3000/user/56f984eb71f1040d1b1de8c3').success(function(response){
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

App.controller('registerController', ['$scope', '$http', function($scope, $http){

    $scope.registerUser = function(){
        $http.post('http://localhost:3000/user', $scope.user).success(function (response){
            $scope.userlogged = response;
            window.location.href = "index.html";

        })

    };

}]);