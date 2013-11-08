var map;
var ajaxRequest;
var pos;
var plotlayers=[];

var initProfileMap = function(lat, lon, zoomLevel){
    var options = {center : new L.LatLng(lat, lon), zoom : zoomLevel };    
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      	osmAttribution = 'Map data &copy; 2012 OpenStreetMap contributors',
        osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});    
    var mapLayer = new L.TileLayer(osmUrl);    
    this.map = new L.Map('profilePagePosMap', options).addLayer(mapLayer);
    map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);
}


function onLocationFound(e) {
	var marker = new L.Marker(e.latlng);
	map.addLayer(marker);
}

function onLocationError(e) {
	console.log(e.message);
}

var loadMarker = function(data){
	var latlon = new L.LatLng(data.lat,data.lon, true);
	var marker = new L.Marker(latlon);
	marker.data=data;
	map.addLayer(marker);
	// bindListeners(marker);
	plotlayers.push(marker);
}
