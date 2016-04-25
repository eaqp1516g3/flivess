/**
 * Created by aitor on 16/4/16.
 */
angular.module('Flivess').controller('registerCtl', ['$scope', '$http', '$cookies','$window', function($scope, $http, $cookies,$window) {
    //var base_url_prod="http://localhost:3000"
    var base_url_prod = "http://147.83.7.157:8080";


    $scope.registerUser = function(){

        $scope.alert.message="";

        console.log("USUARIO: " + $scope.user);
        if($scope.user.password == $scope.reenterpass && !angular.isUndefined($scope.user.username) && !angular.isUndefined($scope.user.email) && !angular.isUndefined($scope.user.password)){
            $http.post(base_url_prod+'/user', $scope.user).success(function(response){
                console.log($scope.user.username);
                $cookies.putObject('user',response);
                $scope.alert.message="";
                window.location.href = "#/home";
            }).error(function (response) {
                     $scope.alertReg = true;
                     $scope.alert.message="Username already exists";
       
                });

        }
       if(angular.isUndefined($scope.user.username)||angular.isUndefined($scope.user.email) || angular.isUndefined($scope.user.password)){
            $scope.alertReg = true;
            $scope.alert.message= "Fields uncomplete";

        }

        else{
            $scope.alertReg=true;
            $scope.alert.message="Passwords dont match";
        }

    };


    $scope.closeAlert=function(){
        $scope.alertReg=false;
        $scope.alert.message="";
    }


}]);





















