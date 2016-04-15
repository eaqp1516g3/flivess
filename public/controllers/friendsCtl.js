/**
 * Created by irkalla on 14.04.16.
 */

angular.module('Flivess').controller('friendsCtl', ['$scope', '$http', function($scope, $http) {


    $scope.hello = "Hello from Friends";


}]);


/*
angular.module('Flivess', ['ngCookies']).controller('friendsCtl', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
    var base_url_prod="http://localhost:3000"
    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);

    var refresh = function() {

        $http.get(base_url_prod + '/friends/' + userLogged.username).success(function (response) {

            console.log("Acabo de recibir los amigos");
            console.log(response);
            $scope.friends = response;

        });
    }
    refresh();

    $scope.remove = function (id) {
        console.log(id);
        $http.delete('/friend/' + id).success(function () {
            refresh();
        });
    };

}]);
*/