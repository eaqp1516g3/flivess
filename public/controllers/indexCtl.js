/**
 * Created by irkalla on 20.04.16.
 */


var base_url_prod="http://localhost:3000"
angular.module('Flivess').controller('indexCtl', ['$scope', '$http',  function($scope, $http) {


    $scope.message="Hello";

    $http.get(base_url_prod+'/allusers/').success(function(data) {
        $scope.users = data;
        console.log("Obtengo users");
    });

}]);