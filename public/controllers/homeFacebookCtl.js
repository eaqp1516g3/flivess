/**
 * Created by aitor on 30/4/16.
 */
angular.module('Flivess').controller('homeFacebookCtl', ['$scope', '$http', '$cookies', '$routeParams', '$rootScope', '$location', function($scope, $http, $cookies, $routeParams, $rootScope, $location) {
    var base_url_prod="http://localhost:8080"
    //var base_url_prod = "http://147.83.7.157:8080";
    $rootScope.isLogged=true;

    console.log($routeParams.facebook_id);

    var loadUser = function(){
        $http.get(base_url_prod + '/users/user/facebook/' + $routeParams.facebook_id).success(function (response) {
            console.log("QUE ME DEVUELVES PAYO?");
            console.log(response[0]);
            $cookies.putObject('user',response[0]);
            $rootScope.userlog = $cookies.getObject('user');
            $location.path('/home');
        });

    }
    loadUser();
}]);