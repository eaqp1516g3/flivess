/**
 * Created by irkalla on 20.04.16.
 */
angular.module('Flivess').controller('indexCtl', ['$scope', '$http', '$cookies', '$location', '$location',  function($scope, $http,$cookies,$location) {
    var base_url_prod="http://localhost:8080"
    //var base_url_prod = "http://147.83.7.157:8080";

    $scope.userloggedInfo = $cookies.getObject('user');

    $scope.perfil = function () {
        $location.path('/profile/miperfil');
    }


    $scope.logOut = function() {
        console.log("DENTRO DEL LOGOUT");
        $cookies.remove('user');
    };
//Search functions

    $http.get(base_url_prod+'/allusers/').success(function(data) {
        $scope.users = data;
        console.log("Obtengo users");
    });

    var _selected;

    $scope.selected = undefined;

    $scope.onSelect = function ($item, $model, $label) {

        window.location.href = "#/profile/" + $model.username;
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        console.log($model);
        $scope.userSelected = $model.username;

    };

    $scope.modelOptions = {
        debounce: {
            default: 500,
            blur: 250
        },
        getterSetter: true
    };
//--------------------------------------







}]);