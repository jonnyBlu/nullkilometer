var INITIALLAT = 52.5233;
var INITIALLON = 13.4127;
var ZOOMONMARKERLEVEL = 17;

var TEXT_ADDRESSSELECTION = "Wähle eine Adresse aus der Liste aus:";

var addAPosMap;
var newPOSMarker;
var newPosPlotlayers=[];

var newPosLat;
var newPosLon;
var newPosAddress;

var firstStepActions = function(){
	$("#newPosMap").show();
	initPosMap(INITIALLAT, INITIALLON, 9); // around Berlin
	placeMarker(INITIALLAT, INITIALLON, "", 9, true);
	registerSearch();
}


var ajaxCall = function(url, dataToSend, onSuccessFunction){
	$.ajax({
		type: 'GET',
		url: url,
		data: dataToSend,
		dataType: 'json',
		success: onSuccessFunction,
		error: function(jqXHR, textStatus, errorThrown){
			$('#locationSearchResults').html('<div>Something went wrong while communicating with nomination.openstreetmaps.org</div>');
			console.warn("searching in OSM DB failed: "+textStatus+": "+jqXHR+" - "+errorThrown);
		}
	});
}

var registerSearch = function(){
	$('#locationSubmit').click(function(event){
		event.preventDefault();
		$('#locationSearchResults').html('');
		var input = $('#locationInput').val();
		if(input.trim() != ""){
			$('#map').append('<img alt="Loading" id="loading-animation" src="//'+window.location.host+'/assets/ajax-loader.gif" />');
			var dataToSend = {
				format: 'json',
				q: input,
				polygon: 0,
				addressdetails: 0
			};
			ajaxCall('http://nominatim.openstreetmap.org/search', dataToSend, getOSMAddress);
		}
		$('#locationInput').val("");
	});
	$("#locationInput").keyup(function(event){
			if(event.keyCode == 13){
    			$("#locationSubmit").click();
			}
	});

}


var getOSMAddress = function(data, textStatus, jqXHR){

	$('#loading-animation').remove();
	$('#locationSearchResults').html(TEXT_ADDRESSSELECTION+'<ul></ul>');
	var resultAmount = data.length;
	if(resultAmount > 1){
		console.log("received "+resultAmount+" Search Results from OSM");
		var resultArr = new Array();
		$("#locationSearchResults").append("<ul></ul>");
		for(var i = 0; i < resultAmount; i++){
			var address = formatAddress(data[i].display_name);
			$("#locationSearchResults ul").append("<li title='"+data[i].lon+","+data[i].lat+"'><a href='#'>"+address+"</a></li>"); 
			$("#locationSearchResults").show();
		}
		$("#locationSearchResults li").click(function(){
			var lon = this.title.split(",")[0];
			var lat = this.title.split(",")[1];
			var chosenAddress = $(this).find("a").html();
			placeMarker(lat, lon, chosenAddress, ZOOMONMARKERLEVEL, false);
		});
	}
	else if(resultAmount == 1){
		console.log("recieved one Search Result from OSM");
		var address = formatAddress(data[0].display_name);
		placeMarker(data[0].lat, data[0].lon, address, ZOOMONMARKERLEVEL, false);
	}
	else {
		$('#locationSearchResults').html('<div>No Search Results</div>');
		console.warn("recieved no Search Results from OSM or something went wrong");
	}
}


var initPosMap = function(lat, lon, zoomLevel) {
    var options = {center : new L.LatLng(lat, lon), zoom : zoomLevel };
    
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      	osmAttribution = 'Map data &copy; 2012 OpenStreetMap contributors',
        osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});
    
    var mapLayer = new L.TileLayer(osmUrl);    
    addAPosMap = new L.Map('newPosMap', options).addLayer(mapLayer);
}


var placeMarker = function(lat, lon, address, zoomLevel,  defaultLocation){
	var coordinates = new L.LatLng(lat, lon, true);
	if(typeof(newPOSMarker)=="undefined"){ // if no marker is on the map
		newPOSMarker = new L.Marker(coordinates, {draggable:true});
		newPOSMarker.data="";
		addAPosMap.addLayer(newPOSMarker);
		newPosPlotlayers.push(newPOSMarker);
	} else{ // if a marker is already on the map
		newPOSMarker.setLatLng(coordinates);
	}
	addAPosMap.panTo(coordinates);
	addAPosMap.setZoom(zoomLevel);

	if(!defaultLocation){
		newPosLat = lat;
		newPosLon = lon;	
		displayAddress(address);
	}	

	setMarkerListener(); 
}

var setMarkerListener = function(){
	newPOSMarker.on('dragend', function (e) {
		var coords = e.target.getLatLng();
		newPosLat= coords.lat;
		newPosLon = coords.lng;
		//alert(newPosLat + "   " + newPosLon);
		var dataToSend = {
			format: 'json',
			q: "["+newPosLat +","+ newPosLon +"]",
			polygon: 0,
			addressdetails: 0
		};
		ajaxCall('http://nominatim.openstreetmap.org/search', dataToSend, function(response){
			var address = formatAddress(response[0].display_name);
			displayAddress(address);
		});
	});
}

var formatAddress = function(osmAddress){
	// var address = osmAddress.substring(0, osmAddress.lastIndexOf(","));
	// return address;
	return osmAddress;
}

var displayAddress = function(address){
	$("#locationSearchResults").html(address);
	$("#loadedAddressLabel").html(address);
	newPosAddress = address;
}
