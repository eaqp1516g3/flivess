/**
 * Created by irkalla on 14.04.16.
 */


angular.module('Flivess').controller('profileEditCtl', ['$scope', '$http', '$cookies', '$location','$mdDialog', function($scope, $http, $cookies, $location,$mdDialog) {
    //var base_url_prod="http://localhost:8080";
    var base_url_prod = "http://147.83.7.157:8080";
    $scope.data={};
    var userLogged = $cookies.getObject('user');
    if(angular.isUndefined($cookies.getObject('user'))) $location.path('');

    console.log(userLogged.username);

    $http.get(base_url_prod + '/user/' + userLogged._id).success(function(response){
        console.log("He obtenido lo que pedia");
        $scope.user = response;
        $scope.contact = "";
    });

    $scope.range_weight = function(start,end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.range_age = function(start,end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.range_height = function(start,end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.updateUser = function(ev) {
        console.log($scope.user._id);
        console.log($scope.user.oldpassword);
        console.log($scope.user.newpassword);
        console.log($scope.data.newpassword);
        var oldpassword = $scope.user.oldpassword;
        var newpassword = $scope.user.newpassword;
        var confirm = $scope.data.newpassword;
        if(newpassword  || confirm  || oldpassword ){
            if(($scope.data.newpassword == $scope.user.newpassword) && (!angular.isUndefined($scope.user.oldpassword)) && (!angular.isUndefined($scope.data.newpassword)) && (!angular.isUndefined($scope.user.newpassword)) ){
                console.log("TODO CORRECTO, HAGO EL PUT");
                $http.put(base_url_prod + '/user/' + $scope.user._id, $scope.user).success(function (response) {
                 $cookies.putObject('user', response);
                 $location.path('/profile/' + userLogged.username);
                 }).error(function(data,err){
                    console.log("ERROR");
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('ERROR')
                            .textContent('Old Passwords doesn\'t match')
                            .ariaLabel('error')
                            .ok('Got it!')
                    );
                });
            }
            else if(($scope.data.newpassword != $scope.user.newpassword) && (!angular.isUndefined($scope.user.oldpassword))){
                console.log(" LOS NUEVOS PASS NO COINCIDEN");
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('ERROR')
                        .textContent('New Passwords doesn\'t match')
                        .ariaLabel('error')
                        .ok('Got it!')
                );
            }
            else{
                console.log("FALTA ALGUN PARAMETRO");
                console.log(ev);
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('ERROR')
                        .textContent('Password fields incomplete')
                        .ariaLabel('error')
                        .ok('Got it!')
                );
            }
        }
        else{
            console.log('normal');
            $http.put(base_url_prod + '/user/' + $scope.user._id, $scope.user).success(function (response) {
             $cookies.putObject('user', response);
             $location.path('/profile/' + userLogged.username);
             });
        }


    };
}]);