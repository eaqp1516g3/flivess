/**
 * Created by irkalla on 14.04.16.
 */

angular.module('Flivess').controller('historicalCtl', ['$scope', '$http', '$cookies', '$rootScope', function($scope, $http, $cookies, $rootScope) {
   console.log("EN HISTORIAL CTL");
    //var base_url_prod="http://localhost:8080"
    var base_url_prod = "http://147.83.7.157:8080";

    $rootScope.isLogged=true;
    var userLogged = $cookies.getObject('user');

    $http.get(base_url_prod + '/tracks/' + userLogged.username).success(function (data) {
        console.log(data);
        $scope.routes = data;
    })
}]);