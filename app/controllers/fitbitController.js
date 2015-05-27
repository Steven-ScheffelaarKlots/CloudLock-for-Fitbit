'use strict';


var app = angular.module("myApp", ['ngRoute', 'leaflet-directive', 'nvd3ChartDirectives']);


/*app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
	    templateUrl: 'view1/view1.html',
	controller: 'View1Ctrl'
	});
}])*/


app.controller("fitbitMapController", [ "$scope", "leafletData", function($scope, leafletData) {
    // Nothing yet
}]);


/*app.controller('View1Ctrl', ['$scope', function($scope) {
    $scope.exampleData = [{
        key: "Series 1",
        values: [ [ "Brian" , 20000] , [ "Steven", 50] , [ "Clayton", 6000] , [ "Rich" , 10000]    ]
    }];
}]);*/
