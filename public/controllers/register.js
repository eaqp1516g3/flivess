/**
 * Created by aitor on 16/4/16.
 */
var base_url_prod="http://localhost:3000"

angular.module('Flivess').controller('registerCtl', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {

    $scope.registerUser = function(){
        console.log("USUARIO: " + $scope.user);
        $http.post(base_url_prod+'/user', $scope.user).success(function (response){
            $cookies.putObject('user',response);
            window.location.href = "index.html";

        })
    };
}]);