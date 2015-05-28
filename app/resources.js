'use strict';

var mod = angular.module('resources', ['ngResource']);

mod.factory('Distance', function($resource) {
  return $resource('http://localhost:6544/distance');
});