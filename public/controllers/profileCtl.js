/**
 * Created by aitor on 19/4/16.
 */
angular.module('Flivess').controller('profileCtl', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
    console.log("DEONTRO DE CONTROLOADOR de profile.html");
    var base_url_prod="http://localhost:3000"
    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);



    $scope.addFriend = function () {
        console.log("Dentro de addFriend");
        var amigos = new Object();
        amigos.username = userLogged.username;
        amigos.friend = "pepe";
        $http.post(base_url_prod+'/addfriend', amigos).success(function(response) {
            console.log(response);
        });
    }
}]);