/**
 * Created by irkalla on 14.04.16.
 */

angular.module('Flivess').controller('profileEditCtl', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {
    //var base_url_prod="http://localhost:8080"
    var base_url_prod = "http://147.83.7.157:8080";

    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);

    $http.get(base_url_prod + '/user/' + userLogged._id).success(function(response){
        console.log("He obtenido lo que pedia");
        $scope.user = response;
        $scope.contact = "";
    });

    $scope.updateUser = function() {

        console.log($scope.user._id);
        $http.put(base_url_prod+'/user/' + $scope.user._id, $scope.user).success(function (response) {
            $cookies.putObject('user',response);


                var formData = new FormData();
                var username = $scope.user.username;
                console.log("tenemos el username " +username);
                var file = $scope.file;

                console.log("tenemos el file " + file);
                formData.append("file", file);


                if ($scope.file) {
                    $http.put('/addimg/' + username, formData, {
                            headers: {
                                "Content-type": undefined
                            },
                            transformRequest: angular.identity
                        }
                    ).success(function (data) {
                        }).error(function (data) {
                            console.log('Error: ' + data);
                        });
                }



            $location.path('/profile/' + response.username);
        })

    };

    pepino = function () {
        console.log("DENTRO DE LA FUNCION PEPINO");
    }
}]);