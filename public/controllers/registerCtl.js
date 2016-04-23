/**
 * Created by aitor on 16/4/16.
 */
var base_url_prod="http://localhost:3000"

angular.module('Flivess').controller('registerCtl', ['$scope', '$http', '$cookies','$window', function($scope, $http, $cookies,$window) {



    $scope.registerUser = function(){

        $scope.alert.message="";

        console.log("USUARIO: " + $scope.user);
        if($scope.user.password == $scope.reenterpass && !angular.isUndefined($scope.user.username) && !angular.isUndefined($scope.user.email) && !angular.isUndefined($scope.user.password)){
            $http.post(base_url_prod+'/user', $scope.user).then(function successCallback(response){
                console.log($scope.user.username);
                $cookies.putObject('user',response);
                $scope.alert.message="";
                window.location.href = "#/home";


            }, function errorCallback(response){

                //IF ERROR, SHOW 'USERNAME ALREADY EXISTS'

            })
        }
       if(angular.isUndefined($scope.user.username)||angular.isUndefined($scope.user.email) || angular.isUndefined($scope.user.password)){
            $scope.alertReg = true;
            $scope.alert.message= "Fields uncomplete";

        }

        else{
            $scope.alertReg=true;
            $scope.alert.message="Passwords dont match";
        }

    };


    $scope.closeAlert=function(){
        $scope.alertReg=false;
        $scope.alert.message="";
    }


}]);





















