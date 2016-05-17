/**
 * Created by aitor on 17/4/16.
 */

angular.module('Flivess').controller('loginCtl', ['$scope', '$http', '$cookies', '$rootScope', '$location', '$window', function($scope, $http, $cookies, $rootScope, $location, $window)  {
    //var base_url_prod="http://localhost:8080"
    var base_url_prod = "http://147.83.7.157:8080";
    $scope.vlogin=true;

    if(!angular.isUndefined($cookies.getObject('user'))){
        $location.path('/home');
    }


    $rootScope.isLogged=false;

    $scope.login = function () {
        console.log($scope.user);
        console.log($scope.user.password);
        $http.post(base_url_prod+'/login', $scope.user).success(function (response) {
            console.log(response);
            $cookies.putObject('user',response);
            $rootScope.userlog = $cookies.getObject('user');
            window.location.href = "#/home";
        }).error(function (response) {
                     $scope.alertReg = true;
                     $scope.alert.message="Username or Password are incorrect";
                });
    }

    $scope.registerUser = function(){

        $scope.alert.message="";

        console.log($scope.usuario);

        if (angular.isUndefined($scope.usuario.username) || angular.isUndefined($scope.usuario.password)){
            console.log("FALTA ALGUN DATO");
            $scope.alertReg = true;
            $scope.alert.message= "Fields uncomplete";

        }

        if($scope.usuario.password != $scope.reenterpass){
            $scope.alertReg=true;
            $scope.alert.message="Passwords don't match";
        }

        else if($scope.usuario.password == $scope.reenterpass && !angular.isUndefined($scope.usuario.username) &&  !angular.isUndefined($scope.usuario.password) &&  !angular.isUndefined($scope.usuario.fullname)){
            $http.post(base_url_prod+'/user', $scope.usuario).success(function(response){
                console.log($scope.usuario.fullname);
                $cookies.putObject('user',response);
                $rootScope.userlog = $cookies.getObject('user');
                $scope.alert.message="";
                window.location.href = "#/home";
            }).error(function (response) {
                $scope.alertReg = true;
                $scope.alert.message="Username already exists";

            });

        }
        else{
            console.log("FALTA ALGUN DATO 22");
            $scope.alertReg = true;
            $scope.alert.message= "Fields uncomplete";

        }
    };


    $scope.closeAlert=function(){
        $scope.alertReg=false;
        $scope.alert.message="";
    }

    $scope.cambio = function () {
        $scope.vlogin=true;
        $scope.alertReg=false;
        $scope.alert.message="";
    }

}]);
