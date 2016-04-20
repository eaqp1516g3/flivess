/**
 * Created by aitor on 16/4/16.
 */
var base_url_prod="http://localhost:3000"

angular.module('Flivess').controller('registerCtl', ['$scope', '$http', '$cookies','$window', function($scope, $http, $cookies,$window) {






    $scope.registerUser = function(){
        console.log("USUARIO: " + $scope.user);
        if($scope.user.password == $scope.reenterpass && $scope.user.username!='' && $scope.user.email!='' && $scope.user.password!=''){
            $http.post(base_url_prod+'/user', $scope.user).success(function (response){
                $cookies.putObject('user',response);
                $scope.alert.message="";
                window.location.href = "index.html";


            })
        }
        if($scope.user.username=='' || $scope.user.email=='' || $scope.user.password==''){
            $scope.alertReg=true;
            $scope.alert.message="The fields with * are mandatory";

        }

        if($scope.user.password == $scope.reenterpass){
            $scope.alertReg = false;
            $scope.alert.message="";
        }

        else{
            $scope.alertReg=true;
            $scope.alert.message="Passwords  dont match";
            //$window.alert("Passwords don't match");
        }
    };




    $scope.closeAlert=function(){
        $scope.alertReg=false;
        $scope.alert.message="";
    }




}]);





















