'use strict';

// Declare app level module which depends on views, and components

var app = angular.module("myApp", ['ngRoute', 'leaflet-directive', 'nvd3ChartDirectives']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);



