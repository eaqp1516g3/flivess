/**
 * Created by aitor on 28/5/16.
 */

angular.module('Flivess').controller('notificationsCtl', ['$scope', '$http', '$cookies', '$rootScope', '$location', function($scope, $http, $cookies, $rootScope, $location) {
    console.log("EN HISTORIAL CTL");
    //var base_url_prod = "http://localhost:8080";
    var base_url_prod = "http://147.83.7.157:8080";
    var userLogged = $cookies.getObject('user');
    if(angular.isUndefined($cookies.getObject('user'))) $location.path('');

    $scope.noFollowing = false;


    $http.get(base_url_prod + '/notifications/user/' + userLogged.username).success(function (response) {
        console.log(response);
        $scope.notifications = response;
        if($scope.notifications == '')
            $scope.noNotifications = true;
        else $scope.noNotifications = false;
    });


    $scope.eliminarNotis = function () {
            $http.delete(base_url_prod + '/notifications/' + userLogged.username + '/all').success(function () {
                $location.path('/home');
                $rootScope.notlength=0;
                $rootScope.notification="";
            });
    };
}]);