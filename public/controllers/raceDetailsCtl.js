/**
 * Created by aitor on 1/5/16.
 */
angular.module('Flivess').controller('raceDetailsCtl', ['$scope', '$http', function($scope, $http) {

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
    }
}]);