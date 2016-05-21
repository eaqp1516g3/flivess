/**
 * Created by aitor on 1/5/16.
 */

angular.module('Flivess').controller('raceDetailsCtl', ['$scope', '$http', '$cookies', '$routeParams', '$location', '$mdDialog', function($scope, $http, $cookies, $routeParams, $location, $mdDialog) {
    var base_url_prod="http://localhost:8080";
    //var base_url_prod = "http://147.83.7.157:8080";


    var userLogged = $cookies.getObject('user');
    console.log("LA ID: "+ $routeParams.id);
    $scope.myTrack = false;
    $http.get(base_url_prod + '/track/' + $routeParams.id).success(function (response) {
        console.log(response);
        console.log(userLogged.username + " y el otro " + response.track_pedido.username);
        if(userLogged.username == response.track_pedido.username) $scope.myTrack = true;

        var final_time_m = Math.floor(response.track_pedido.time / 60);
        var final_time_s = Math.floor(response.track_pedido.time - (final_time_m * 60));
        response.track_pedido.time =final_time_m+' min '+final_time_s+' s';

        if(response.track_pedido.distance<1) response.track_pedido.distance=response.track_pedido.distance * 1000 + ' m';
        else response.track_pedido.distance=response.track_pedido.distance + ' Km';

        if (response.track_pedido.avg_speed>0)response.track_pedido.avg_speed= Math.floor(60/(response.track_pedido.avg_speed)).toFixed(2);

        $http.get(response.track_pedido.pointsurl).success(function(data) {
            var map = new google.maps.Map(document.getElementById("map"),
                {
                    zoom: 17,
                    center: new google.maps.LatLng(data[1].latitude,data[1].longitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });


            var route = [];
            for (var i = 0; i < data.length; i++){
                route[i] = new google.maps.LatLng(data[i].latitude,data[i].longitude);
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
                position:new google.maps.LatLng(data[0].latitude,data[0].longitude),
                label: 'START'
            });

            marker.setMap(map);

            var icon = {
                url: "css/maps/flag2.png", // url
                scaledSize: new google.maps.Size(50, 50), // scaled size
            };
            var marker2=new google.maps.Marker({
                position:new google.maps.LatLng(data[data.length-1].latitude,data[data.length-1].longitude),
                icon: icon
            });

            marker2.setMap(map);
        });

        $scope.route = response.track_pedido;


        console.log(response.ranking.length);
        response.ranking.sort(function(a, b) {
            var s = parseFloat(a.time) - parseFloat(b.time);
            console.log("EL A: " + s);
            return s;
        });
        for(var i=0; i<response.ranking.length; i++) {
            console.log("1 TIEMPO: "+response.ranking[i].time);
            var final_time_m = Math.floor(response.ranking[i].time / 60);
            var final_time_s = Math.floor(response.ranking[i].time - (final_time_m * 60));
            response.ranking[i].time = final_time_m + ' min ' + final_time_s + ' s';
            console.log("2 TIEMPO: "+ response.ranking[i].time);
        }

        $scope.ranking = response.ranking;

    });

    $scope.showConfirm = function(ev, id) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Would you like to delete this track?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('YES')
            .cancel('NO');
        $mdDialog.show(confirm).then(function() {
            $http.delete(base_url_prod + '/track/' + id).success(function (data) {
                $location.path('/historical');
            });
        }, function() {
            console.log("EN EL POZO");
        });
    };




    $scope.details = function (id) {
        $location.path('/details/' + id);
    };



    $scope.chartObject = {
        "type": "AreaChart",
        "displayed": false,
        "data": {
            "cols": [
                {
                    "id": "month",
                    "label": "Month",
                    "type": "string",
                    "p": {}
                },
                {
                    "id": "laptop-id",
                    "label": "Laptop",
                    "type": "number",
                    "p": {}
                },
                {
                    "id": "desktop-id",
                    "label": "Desktop",
                    "type": "number",
                    "p": {}
                },
                {
                    "id": "server-id",
                    "label": "Server",
                    "type": "number",
                    "p": {}
                },
                {
                    "id": "cost-id",
                    "label": "Shipping",
                    "type": "number"
                },
                {
                    "id": "",
                    "role": "tooltip",
                    "type": "string",
                    "p": {
                        "role": "tooltip",
                        "html": true
                    }
                }
            ],
            "rows": [
                {
                    "c": [
                        {
                            "v": "January"
                        },
                        {
                            "v": 19,
                            "f": "42 items"
                        },
                        {
                            "v": 12,
                            "f": "Ony 12 items"
                        },
                        {
                            "v": 7,
                            "f": "7 servers"
                        },
                        {
                            "v": 4
                        },
                        {
                            "v": " <b>Shipping 4</b><br /><img src=\"http://icons.iconarchive.com/icons/antrepo/container-4-cargo-vans/512/Google-Shipping-Box-icon.png\" style=\"height:85px\" />",
                            "p": {}
                        }
                    ]
                },
                {
                    "c": [
                        {
                            "v": "February"
                        },
                        {
                            "v": 13
                        },
                        {
                            "v": 1,
                            "f": "1 unit (Out of stock this month)"
                        },
                        {
                            "v": 10
                        },
                        {
                            "v": 2
                        },
                        {
                            "v": " <b>Shipping 2</b><br /><img src=\"http://icons.iconarchive.com/icons/antrepo/container-4-cargo-vans/512/Google-Shipping-Box-icon.png\" style=\"height:85px\" />",
                            "p": {}
                        }
                    ]
                },
                {
                    "c": [
                        {
                            "v": "March"
                        },
                        {
                            "v": 24
                        },
                        {
                            "v": 5
                        },
                        {
                            "v": 11
                        },
                        {
                            "v": 6
                        },
                        {
                            "v": " <b>Shipping 6</b><br /><img src=\"http://icons.iconarchive.com/icons/antrepo/container-4-cargo-vans/512/Google-Shipping-Box-icon.png\" style=\"height:85px\" />",
                            "p": {}
                        }
                    ]
                }
            ]
        },
        "options": {
            "title": "Sales per month",
            "isStacked": "true",
            "fill": 20,
            "displayExactValues": true,
            "vAxis": {
                "title": "Sales unit",
                "gridlines": {
                    "count": 12
                }
            },
            "hAxis": {
                "title": "Date"
            },
            "tooltip": {
                "isHtml": true
            }
        },
        "formatters": {},
        "view": {}
    };

}]);