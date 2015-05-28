'use strict';

function fitbitController($scope, $filter, $http) {
    
    var startDest = {lat: 42.3699388, lng: -71.2458321}; // CloudLock HQ
    var endDest   = {lat: 37.790599,  lng: -71.2458321};
	$scope.gotStuff = false;
    function randColor(){
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
	    color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
    }

    $scope.exampleData = [];
    $scope.paths   = {};
    $scope.markers = {};
    $scope.colors  = [];
    $scope.center  = {
        lat: 37.5960374,
        lng: -97.0452066,
	zoom: 4
    };	
    $scope.defaults = {
        scrollWheelZoom: false
    };
    
    
    var usersDistance = [
	{name: 'Tom',      distance: 1.2, avatar: "https://pbs.twimg.com/profile_images/517321674471923712/bFqGdWJL_400x400.jpeg"},
	{name: 'Jan',      distance: 2.3, avatar: "https://pbs.twimg.com/profile_images/517321674471923712/bFqGdWJL_400x400.jpeg"},
	{name: 'Mike',     distance: 5.1, avatar: "https://pbs.twimg.com/profile_images/517321674471923712/bFqGdWJL_400x400.jpeg"},
	{name: 'Jane',     distance: 4.5, avatar: "https://pbs.twimg.com/profile_images/517321674471923712/bFqGdWJL_400x400.jpeg"},
	{name: 'Bobbert',  distance: 4.3, avatar: "https://pbs.twimg.com/profile_images/517321674471923712/bFqGdWJL_400x400.jpeg"},
	{name: 'Sarah',    distance: 1.3, avatar: "https://pbs.twimg.com/profile_images/517321674471923712/bFqGdWJL_400x400.jpeg"},
	{name: 'Tedison',  distance: 3.2, avatar: "https://pbs.twimg.com/profile_images/517321674471923712/bFqGdWJL_400x400.jpeg"}];
    
    $http.get('http://localhost:6544/distance')
        .success(function(data, status, headers, config) {
	    console.log( data );
	    data.forEach(function(obj){ usersDistance.push(obj); });
		$scope.gotStuff = true;
	    createPath(usersDistance);
	    
	    $scope.colorFunction = function() {   
		return function(d, i) {
	            console.log("Colors", d, $scope.colors);
		    return $scope.colors[i];
	   	};
	    };
	    
	    
	    console.log( "Here", usersDistance = $filter('orderBy')(usersDistance, '-distance'));
	    
	    // Map user distance to D3 compliant data object.
	    /*  usersDistance.forEach(function(obj){
		var temp = {
		key: obj.name,
		    values: [[obj.name, obj.distance]]
		    //	    color: "#2f2f2f"
		    };*/
	    $scope.exampleData = [{
		key: "Series 1",
		values: $filter('orderBy')(usersDistance, '-distance').map( function(obj) { return [obj.name, obj.distance]; })
	    }]; 
	    
	    //$scope.exampleData.push(temp);
	    //    color="colorFunction()"
	    console.log("woooo", usersDistance);
    
	}).error(function(data){
	    console.log( data, 'CRY');
	    // Cry
    	}); 
    
    
    function radians(deg){
	return deg * (Math.PI / 180);
    };

    function degrees(rad){
	return rad * (180 / Math.PI);
    };


    function getMidpoint( p1, p2) {
	var dLon = radians(p2.lng - p1.lng);

	//convert to radians
	var lat1 = radians(p1.lat);
	var lat2 = radians(p2.lat);
	var lon1 = radians(p1.lng);

	console.log( dLon, lat1, lat2, lon1);
	
	var Bx = Math.cos(lat2) * Math.cos(dLon);
	var By = Math.cos(lat2) * Math.sin(dLon);
	
	var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
	var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);


	return {lat: lat3 * 180 / Math.PI, lng: lon3 * 180 / Math.PI};
	lat3_OUT = lat3;
	lon3_OUT = lon3;
    }
    
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
	
	var color = '' ;
	for( var i = 0; i < obj.length ; i++ ){
	    color = randColor();
	    $scope.colors.push( color ) ;
	    nextCoords = calcCoords( prevCoords, obj[i].distance );
	    var tempPath = {	    
		color: color,
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
		icon: {
		    iconUrl: obj[i].avatar,
		    iconSize: [40, 40],
		    iconAnchor: [20, 40],
		    popupAnchor: [3, -32],
		    shadowSize: [0, 0],
		    shadowAnchor: [0, 0]
		},
		
		message: obj[i].name
	    };
	    
	    // Inserts new objects into existing objects.
	    // Needs to not be awful
	    $scope.paths[color]   = tempPath;
	    $scope.markers[color] = tempMarker;	    
	    prevCoords = nextCoords; 
	}

	var centerCoords =  getMidpoint(startDest, prevCoords);
	$scope.center.lat =  centerCoords.lat;
	$scope.center.lng =  centerCoords.lng;
	$scope.center.zoom = 5 ;
	console.log( "Bottom" );
    }
}

fitbitController.$inject = ["$scope", "$filter", "$http"];
