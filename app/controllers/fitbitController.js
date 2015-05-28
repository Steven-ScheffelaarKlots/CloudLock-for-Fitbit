'use strict';

function fitbitController($scope, $filter) {
    
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
	{name: 'Tom',      distance: 12},
	{name: 'Jan',      distance: 23},
	{name: 'Mike',     distance: 43},
	{name: 'Jane',     distance: 45},
	{name: 'Bobbert',  distance: 43},
	{name: 'Sarah',    distance: 13},
	{name: 'Tedison',  distance: 32}];

    usersDistance = $filter('orderBy')(usersDistance, '-distance');

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
    
    function calcCoords(from, dist){
	//http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
	
	var conversion = 1.115;

	// Following used for testing. Will be refactored.
	var lat = from.lat;
	var lng = from.lng - ( dist * .15 );  // Not real, not yet: 
	var temp = {lat: lat, lng: lng}; // :(
	console.log( temp );
	return temp;
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


fitbitController.$inject = ["$scope", "$filter"];

