'use strict';
angular.module('myApp.view1', ['ngRoute', 'leaflet-directive', 'nvd3ChartDirectives'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {
      angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        }
    });

        $scope.exampleData = [{
                     key: "Series 1",
                     values: [ [ "Brian" , 20000] , [ "Steven", 50] , [ "Clayton", 6000] , [ "Rich" , 10000]    ]
                     }];
}]);