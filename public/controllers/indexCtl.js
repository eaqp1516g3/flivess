/**
 * Created by irkalla on 20.04.16.
 */
angular.module('Flivess').controller('indexCtl', ['$scope', '$http', '$cookies', '$location', '$location',  function($scope, $http,$cookies,$location) {
    var base_url_prod="http://localhost:3000"
    //var base_url_prod = "http://147.83.7.157:8080";

    $scope.perfil = function () {
        $location.path('/profile/miperfil');
    }


    //Nav controller
    $scope.checkNavBar = function() {
        var isLogged = $cookies.getObject('user');
        console.log('Este es el logeado: ' + isLogged);
        if (!angular.isUndefined(isLogged)) {
            $scope.navLogged = true;
            $scope.navInit = false;
            console.log('1');
            $location.path('/home');
        }
        else{
            $scope.navInit = true;
            $scope.navLogged = false;
            console.log('2');
        }

    }

    $scope.checkNavBar();

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