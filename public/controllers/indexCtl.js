/**
 * Created by irkalla on 20.04.16.
 */


var base_url_prod="http://localhost:3000"
angular.module('Flivess').controller('indexCtl', ['$scope', '$http',  function($scope, $http) {


    $scope.message="Hello";

    $http.get(base_url_prod+'/allusers/').success(function(data) {
        $scope.users = data;
        console.log("Obtengo users");
    });



    var _selected;

    $scope.selected = undefined;
    //$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    // Any function returning a promise object can be used to load values asynchronously


    $scope.ngModelOptionsSelected = function(value) {
        if (arguments.length) {
            _selected = value.username;
        } else {
            return _selected;

        }
    };

    $scope.modelOptions = {
        debounce: {
            default: 500,
            blur: 250
        },
        getterSetter: true
    };







}]);