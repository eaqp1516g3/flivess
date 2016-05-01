/**
 * Created by irkalla on 14.04.16.
 */

angular.module('Flivess').controller('homeCtl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
    $rootScope.isLogged=true;
    var inicio = function() {
        $http.get('../controllers/generated.json').success(function(data) {
            console.log(data);
            var map = new google.maps.Map(document.getElementById("map"),
                {
                    zoom: 17,
                    center: new google.maps.LatLng(data[1].coords.latitude,data[1].coords.longitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });


            var route = [];
            for (var i = 0; i < data.length; i++){
                console.log(data[i].coords.latitude);
                route[i] = new google.maps.LatLng(data[i].coords.latitude,data[i].coords.longitude);
            }
            var path = new google.maps.Polyline(
                {
                    path: route,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
            path.setMap(map);

            var marker=new google.maps.Marker({
                position:new google.maps.LatLng(data[0].coords.latitude,data[0].coords.longitude),
            });

            marker.setMap(map);

            var marker2=new google.maps.Marker({
                position:new google.maps.LatLng(data[data.length-1].coords.latitude,data[data.length-1].coords.longitude),
            });

            marker2.setMap(map);
        });

    }
    inicio();

}]);