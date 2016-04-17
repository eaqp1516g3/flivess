/**
 * Created by irkalla on 14.04.16.
 */

angular.module('Flivess').controller('homeCtl', ['$scope', '$http', function($scope, $http) {
    console.log($scope.myVar);
    $scope.myVar = !$scope.myVar;
    console.log($scope.myVar);
    $scope.message = "Hello from Home Controller";


}]);