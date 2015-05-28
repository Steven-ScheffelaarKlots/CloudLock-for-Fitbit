'use strict';



angular.module('myApp.view1', ['ngRoute', 'leaflet-directive', 'nvd3ChartDirectives' ])

function fitbitController($scope, leafletData) {
    
    var startDest = {lat: 42.3699388, lng: -71.2458321}; // CloudLock HQ
    var endDest   = {lat: 37.790599,  lng: -71.2458321};

    function randColor(){
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
	    color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
    }

    var usersDistance = [
	{name: 'Tom',      distance: 120},
	{name: 'Jan',      distance: 230},
	{name: 'Mike',     distance: 430},
	{name: 'Jane',     distance: 450},
	{name: 'Bobbert',  distance: 430},
	{name: 'Sarah',    distance: 130},
	{name: 'Tedison',  distance: 320}];

    // Map user distance to D3 compliant data object.
    $scope.exampleData = [{
	key: "Series 1",
	values: usersDistance.map( function(obj) { return [obj.name, obj.distance]; })
    }];
    
    $scope.paths   = {};
    $scope.markers = {};
    $scope.center  = {
        lat: 37.5960374,
        lng: -97.0452066,
	zoom: 4
    };	

    function radians(deg){
	return deg * (Math.PI / 180);
    };
    function degrees(rad){
	return rad * (180 / Math.PI);
    };
    
    function getBearing(startLat,startLong,endLat,endLong){
	startLat   = radians(startLat);
	startLong  = radians(startLong);
	endLat     = radians(endLat);
	endLong    = radians(endLong);

	var dLong = endLong - startLong;

	var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
	if (Math.abs(dLong) > Math.PI){
	    if (dLong > 0.0)
		dLong = -(2.0 * Math.PI - dLong);
	    else
		dLong = (2.0 * Math.PI + dLong);
	}

	return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
    }
    
    function calcCoords(from, dist){
	//http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
	var startDest = {lat: 42.3699388, lng: -71.2458321}; // CloudLock HQ
	var endDest   = {lat: 45.5168567, lng: -122.6725146}; // Salesforce HQ

	var brng = getBearing(startDest.lat, startDest.lng, endDest.lat, endDest.lng);// geo.bearing(startDest, endDest);
		
	var R  = 6478.1;
	var km = dist * 1.60934;

	var lat1 = from.lat * Math.PI / 180;
	var lng1 = from.lng * Math.PI / 180;

	var lat2 = Math.asin( Math.sin(lat1) * Math.cos(km/R) +
			  Math.cos(lat1) * Math.sin(km/R) * Math.cos(brng));

	var lng2 = lng1 + Math.atan2(Math.sin(brng)*Math.sin(km/R)*Math.cos(lat1),
				 Math.cos(km/R)-Math.sin(lat1)*Math.sin(lat2));

	return {lat: lat2 * 180 / Math.PI, lng: lng2 * 180 / Math.PI};
    };
    
    
    function createPath(obj){
	var startDest = {lat: 42.3699388, lng: -71.2458321}; // CloudLock HQ
	var endDest   = {lat: 37.790599,  lng: -71.2458321};
	
	var prevCoords = startDest;
	var nextCoords = {lat: 0, lng: 0}; // Temp value
	
	for( var i = 0; i < obj.length ; i++ ){

	    nextCoords = calcCoords( prevCoords, obj[i].distance );
	    var tempPath = {	    
		color: randColor(),
		weight: 6,
		latlngs: [
		    prevCoords,
		    nextCoords
		]
	    };
	    
	    var tempMarker = {
	        lat: nextCoords.lat,
		lng: nextCoords.lng,
		focus: true,
		draggable: false,
		title: obj[i].name,
		
		
		message: obj[i].name,
		
	    };

	    // Inserts new objects into existing objects.
	    // Needs to not be awful
	    $scope.paths[obj[i].name]   = tempPath;
	    $scope.markers[obj[i].name] = tempMarker;
	    
	    prevCoords = nextCoords; 
	}

	console.log( $scope.paths );
	console.log( $scope.markers );
    }
    
    createPath(usersDistance);
}


fitbitController.$inject = [ "$scope", "leafletData"];

