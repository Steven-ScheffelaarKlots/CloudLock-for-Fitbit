'use strict';

// Declare app level module which depends on views, and components

var app = angular.module("myApp", ['ngRoute', 'leaflet-directive', 'nvd3ChartDirectives','resources']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
	    templateUrl: 'templates/fitbitTemplate.html',
	    controller: 'fitbitController'
	});
}]);



