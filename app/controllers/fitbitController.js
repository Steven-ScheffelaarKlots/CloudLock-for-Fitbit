'use strict';

angular.module('myApp.view1', ['ngRoute', 'leaflet-directive', 'nvd3ChartDirectives'])

function fitbitController($scope, leafletData, Distance) {
    $scope.exampleData = [{
        key: "Series 1",
        values: [ [ "Brian" , 20000] , [ "Steven", 50] , [ "Clayton", 6000] , [ "Rich" , 10000]    ]
    }];

    /*
        $scope.exampleData = Distance.get({
        }, function(data) {

            $scope.data = data.payload;

        },function() {

            $scope.data = "N/A";
        });
    */

    angular.extend($scope, {
        center: {
            lat: 48,
            lng: 4,
            zoom: 4
        },
        layers: {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
                mapbox_light: {
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    options: {
                        apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                        mapid: 'bufanuvols.lia22g09'
                    }
                }
            }
        },
        paths: {
            p1: {
                color: '#008000',
                weight: 8,
                latlngs: [
                    { lat: 51.50, lng: -0.082 },
                    { lat: 48.83, lng: 2.37 },
                    { lat: 41.91, lng: 12.48 }
                ],
            }
        },
        markers: {
            london: {
                lat: 51.50,
                lng: -0.082,
            },
            paris: {
                lat: 48.83,
                lng: 2.37,
            },
            roma: {
                lat: 41.91,
                lng: 12.48,
            }
        },
        defaults: {
            scrollWheelZoom: false
        }
    });
}


fitbitController.$inject = [ "$scope", "leafletData","Distance"];

