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
                    strokeOpacity: 0.7,
                    strokeWeight: 3
                });
            path.setMap(map);

            var marker=new google.maps.Marker({
                position:new google.maps.LatLng(data[0].coords.latitude,data[0].coords.longitude),
                label: 'START'
            });

            marker.setMap(map);

            var icon = {
                url: "css/maps/flag2.png", // url
                scaledSize: new google.maps.Size(50, 50), // scaled size
            };
            var marker2=new google.maps.Marker({
                position:new google.maps.LatLng(data[data.length-1].coords.latitude,data[data.length-1].coords.longitude),
                icon: icon
            });

            marker2.setMap(map);
        });

    }
    inicio();

}]);