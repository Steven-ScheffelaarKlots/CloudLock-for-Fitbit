'use strict';

angular.module('myApp.view1', ['ngRoute', 'leaflet-directive', 'nvd3ChartDirectives'])

function fitbitController($scope, leafletData) {
    $scope.exampleData = [{
        key: "Series 1",
        values: [ [ "Brian" , 20000] , [ "Steven", 50] , [ "Clayton", 6000] , [ "Rich" , 10000]    ]
    }];
}


fitbitController.$inject = [ "$scope", "leafletData"];

