/**
 * Created by aitor on 17/4/16.
 */

angular.module('Flivess').controller('loginCtl', ['$scope', '$http', '$cookies', function($scope, $http, $cookies)  {
    console.log("DENTRO DE loginCtl");
    $scope.login = function () {
        $http.post('/login', $scope.user).success(function (response) {
            console.log(response);
            $cookies.putObject('user',response);
            window.location.href = "#/home";
        })
    }
}]);
