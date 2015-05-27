'use strict';

angular.module('myApp.view1', ['ngRoute', 'leaflet-directive', 'nvd3ChartDirectives'])

function fitbitController($scope, leafletData) {
    $scope.exampleData = [{
        key: "Series 1",
        values: [ [ "Brian" , 20000] , [ "Steven", 50] , [ "Clayton", 6000] , [ "Rich" , 10000]    ]
    }];

    angular.extend($scope, {
        center: {
            lat: 48,
            lng: 4,
            zoom: 4
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


fitbitController.$inject = [ "$scope", "leafletData"];

