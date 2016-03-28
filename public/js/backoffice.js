/**
 * Created by irkalla on 25.03.16.
 */
var base_url_prod="http://147.83.7.157:8080"
var App = angular.module('backoffice', []);


App.controller('boController', ['$scope', '$http', function($scope, $http) {




    $http.get(base_url_prod+'/user/56f6671361501799171040e4').success(function(response){

        console.log("He obtenido lo que pedia");
        $scope.user = response;
        $scope.contact = "";
    });

    $scope.updateUser = function() {
        console.log($scope.user._id);
        $http.put(base_url_prod+'/user/' + $scope.user._id, $scope.user).success(function (response) {
            window.alert("Changes saved");
        })

    };


}]);

App.controller('registerController', ['$scope', '$http', function($scope, $http){

    $scope.registerUser = function(){
        $http.post(base_url_prod+'/user', $scope.user).success(function (response){
            $scope.userlogged = response;
            window.location.href = "index.html";

        })

    };

}]);