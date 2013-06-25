var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];


function initmap() {
    var options = {center : new L.LatLng(51.3, 0.7), zoom : 7 };
    
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      	osmAttribution = 'Map data &copy; 2012 OpenStreetMap contributors',
        osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});
    
    var mapLayer = new L.TileLayer(osmUrl);
    
    this.map = new L.Map('map', options).addLayer(mapLayer);

    map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);
}

function locateUser(){
	this.map.locate({setView : true});
}

function onLocationFound(e) {
	var marker = new L.Marker(e.latlng);
	map.addLayer(marker);
}

function onLocationError(e) {
	console.log(e.message);
}

function loadMarkers(){
	// set up AJAX request
	$.ajax({
		type: "GET",
  		dataType: "json",
		url: "test.json",
	  	success: onSuccessLoadMarkers,
	  	error: function(xhr, error){
        	console.debug(xhr); console.debug(error);
 		}
	}).done(function() {
	});
}

function onSuccessLoadMarkers(plotlist){
	removeMarkers();
	for (i=0;i<plotlist.length;i++) {
		var plotll = new L.LatLng(plotlist[i].lat,plotlist[i].lon, true);
		var plotmark = new L.Marker(plotll);
		plotmark.data=plotlist[i];
		map.addLayer(plotmark);
		bindListeners(plotmark, plotlist[i]);
		plotlayers.push(plotmark);
	}
}

function bindListeners(marker, plot){
	marker.on('click', function(evt) {
		marker.bindPopup("<h3>"+plot.name+"</h3>Verkaufte Produktkategorien: "+plot.product_categories, {className: 'click-popup'});
	});

	marker.on('mouseover', function(evt) {
		//evt.target.closePopup();
	    marker.bindPopup("Verkaufte Produktkategorien: "+plot.product_categories, {className: 'mouseover-popup'});
	    marker.openPopup();
	});
	//TODO: only the popup that appeared on mouseover
	marker.on('mouseout', function(evt) {
		//if($(".mouseover-popup").length>0){
				//$(".mouseover-popup").remove();
		//}
	
	});
}

function removeMarkers() {
	for (i=0;i<plotlayers.length;i++) {
		map.removeLayer(plotlayers[i]);
	}
	plotlayers=[];
}
