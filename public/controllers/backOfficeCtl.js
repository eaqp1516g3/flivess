/**
 * Created by irkalla on 14.04.16.
 */
var base_url_prod="http://localhost:3000"

angular.module('Flivess').controller('backOfficeCtl', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {


    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);

    $http.get(base_url_prod + '/user/' + userLogged._id).success(function(response){
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





//No descomentar esta parte. Old
/*
App.controller('registerController', ['$scope', '$http','$cookies', function($scope, $http, $cookies){

    $scope.registerUser = function(){
        $http.post(base_url_prod+'/user', $scope.user).success(function (response){
            $cookies.putObject('user',response);
            $scope.userlogged = response;
            window.location.href = "index.html";

        })

    };

}]);
    */