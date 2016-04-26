/**
 * Created by aitor on 17/4/16.
 */

angular.module('Flivess').controller('loginCtl', ['$scope', '$http', '$cookies', '$rootScope', '$location', function($scope, $http, $cookies, $rootScope, $location)  {
    var checkLogged = function () {
        if(!angular.isUndefined($cookies.getObject('user'))){
            $location.path('/home');
        }
    }
    checkLogged();

    console.log("DENTRO DE loginCtl");
    var base_url_prod="http://localhost:3000"
    //var base_url_prod = "http://147.83.7.157:8080";
    $rootScope.isLogged=false;

    $scope.login = function () {
        console.log($scope.user);
        console.log($scope.user.password);
        $http.post(base_url_prod+'/login', $scope.user).success(function (response) {
            console.log(response);
            $cookies.putObject('user',response);
            window.location.href = "#/home";
        }).error(function (response) {
                     $scope.alertReg = true;
                     $scope.alert.message="Username or Password are incorrect";
       
                });
    }
}]);
