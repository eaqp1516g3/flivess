/**
 * Created by irkalla on 14.04.16.
 */

angular.module('Flivess').controller('homeCtl', ['$scope', '$http', '$cookies', '$rootScope', function($scope, $http, $cookies, $rootScope) {
    var base_url_prod="http://localhost:8080"
    //var base_url_prod = "http://147.83.7.157:8080";

    $rootScope.isLogged=true;
    var userLogged = $cookies.getObject('user');
    console.log("EL USERNAME: "+ userLogged.username);
    $scope.noFollowing = false;

    $http.get(base_url_prod + '/tracks/friends/' + userLogged.username).success(function (data) {
        console.log(data);
        if(data=="") {
            $scope.noFollowing = true;
        }
        else{
            var datos = data;
            for (var i = 0; i < data.length; i++) {
                var int = i;
                $http.get(datos[i].pointsurl).success(function (data) {
                    console.log(data);
                    datos[int].center = data[1].latitude + "," + data[1].longitude;
                    console.log("EN CENTRO: " + datos[int].center);
                    //zoom:17
                    //mapTypeId: google.maps.MapTypeId.ROADMAP

                    for (var i = 0; i < data.length; i++) {
                        if (i == 0) datos[int].path = data[i].latitude + "," + data[i].longitude;
                        else datos[int].path += "|" + data[i].latitude + "," + data[i].longitude;
                        console.log(datos[int].path);
                        console.log("LA VAR I: " + i);
                    }

                    //strokeColor: "#FF0000",
                    //strokeOpacity: 0.7,
                    //strokeWeight: 3
                });
            }
            $scope.routes = datos;
        }
    })
}]);