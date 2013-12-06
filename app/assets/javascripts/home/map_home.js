var HomeMap = function(){
	var 
	ajaxRequest,
	pos, 
	plotlayers=[],
	curPosMarkerLayer,
	zoomLevel,
	map,
	markerIconWidth = 24,
	markerIconHeight = 40,
	curPosMarkerIconWidth = 50,
	curPosMarkerIconHeight = 66,	
	curPosMarkerIcon = L.icon({
	    iconUrl: userIconImageLocation,
	    iconSize:     [curPosMarkerIconWidth, curPosMarkerIconHeight], // size of the icon
	    shadowSize:   [50, 64], // size of the shadow
	    iconAnchor:   [curPosMarkerIconWidth/2, curPosMarkerIconHeight], // point of the icon which will correspond to marker's location
	    shadowAnchor: [4, 62],  // the same for the shadow
	    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
	}),
	markerIcon = L.icon({
	    iconUrl: shopTypeIconImageLocation+shopTypeIconImageUrlDefault,
	    iconSize:     [markerIconWidth, markerIconHeight], // size of the icon
	    shadowSize:   [50, 64], // size of the shadow
	    iconAnchor:   [markerIconWidth/2, markerIconHeight], // point of the icon which will correspond to marker's location
	    shadowAnchor: [4, 62],  // the same for the shadow
	    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
	}),
	initmap = function(lat, lon, zoomLevel){
	    var options = {center : new L.LatLng(lat, lon), zoom : zoomLevel };     
	    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	      	osmAttribution = 'Map data &copy; 2012 OpenStreetMap contributors',
	        osm = new L.TileLayer(osmUrl, {maxZoom: 18, minZoom:2, attribution: osmAttribution});    
	    var mapLayer = new L.TileLayer(osmUrl);    
	    map = new L.Map('map', options).addLayer(mapLayer);
	    map.on('locationfound', onLocationFound);
		map.on('locationerror', onLocationError);
	},
	locateUser = function(zoomLevel){
		this.zoomLevel = zoomLevel;
		map.locate({setView : true, maxZoom:  zoomLevel});
	},
	loadMarkers = function (){
		// set up AJAX request
		$.ajax({
			type: "GET",
	  		dataType: "json",
			url: "api/point_of_sales",
		  	success: onSuccessLoadMarkers,
		  	error: function(xhr, error){
	        	console.debug(xhr); console.debug(error);
	 		}
		}).done(function() {
		});
	},
	getOSMAddressHome = function (data){
		var resultsSelector = $("#locationResultPopup");

		resultsSelector.html("<p>"+TEXT_ADDRESSSELECTION+'</p><ul></ul>');
		var resultAmount = data.length;
		if(resultAmount > 1){
			console.log("received "+resultAmount+" Search Results from OSM");
			var resultArr = new Array();
			var previousAddress = "";
			for(var i = 0; i < resultAmount; i++){
				// var address = formatAddress(data[i].display_name);
				var address = data[i].display_name;
				if(address != previousAddress){
					resultsSelector.find("ul").append("<li title='"+data[i].lon+","+data[i].lat+"'><a href='#'>"+address+"</a></li>"); 
				}			
				previousAddress = address;
			}
			resultsSelector.slideDown();
			$("#mapFilterContainer").slideUp();

			resultsSelector.find("li").click(function(){
				var lon = this.title.split(",")[0];
				var lat = this.title.split(",")[1];
				var chosenAddress = $(this).find("a").html();
				zoomTo(lat, lon, ZOOMONMARKERLEVEL);
				resultsSelector.slideUp();
			});
		}
		else if(resultAmount == 1){
			console.log("recieved one Search Result from OSM");
			// var address = formatAddress(data[0].display_name);
			var address = data[0].display_name;
			zoomTo(data[0].lat, data[0].lon, ZOOMONMARKERLEVEL);
		}
		else {
			resultsSelector.html('<div>No Search Results</div>');
			console.warn("No Search Results received from OSM or something went wrong");
		}
	},
	onLocationFound = function(e) {
		curPosMarkerLayer = new L.Marker(e.latlng, {icon: curPosMarkerIcon});
		map.addLayer(curPosMarkerLayer);
	},
	onLocationError = function(e) {
		console.log(e.message);
	},
	onSuccessLoadMarkers = function(results){
		console.log(results);
		var pos = results.pointOfSales;
		removeMarkers();
		for (i=0;i<pos.length;i++) {
			var shopTypeId = pos[i].posTypeId;
			markerIcon.options.iconUrl = shopTypeIconImageLocation+shopTypeIconImageUrls[shopTypeId];

			var latlon = new L.LatLng(pos[i].lat,pos[i].lon, true);
			var marker = new L.Marker(latlon, {icon: markerIcon});
			marker.data=pos[i];

			map.addLayer(marker);
			bindListeners(marker);
			plotlayers.push(marker);
		}
	},
	bindListeners = function(marker){
		var posId = marker.data.id;
		var posName = marker.data.name;//plot.name;
		var posType = shopTypeNames[marker.data.posTypeId];
		var productCategoryIds_readable = generateReadableList(marker.data.productCategoryIds, productCategoryNames);
		var openingTimes = generateReadableList(marker.data.openingTimes, weekDayNames);
		var address =  marker.data.address;

		marker.on('click', function(evt) {
			$("#infoboxContent .title").html(posName);
			$("#infoboxContent .type").html(posType);
			$("#infoboxContent .productCategories").html("Verkaufte Produktkategorien: " + productCategoryIds_readable);
			$("#infoboxContent .openingTimes").html("Öffnungszeiten: " + openingTimes);

			var infoBoxContent = $("#hiddenInfoboxContentContainer").html();
			marker.bindPopup(infoBoxContent, {className: 'click-popup'});
			//TODO: edit correctly
			$("#linkToProfilePage").attr("href", "/profilePage?id="+posId);
		});

		marker.on('mouseover', function(evt) {
			//evt.target.closePopup();
		    marker.bindPopup(productCategoryIds_readable, {className: 'mouseover-popup'});
		    marker.openPopup();
		});
		//TODO: only the popup that appeared on mouseover
		marker.on('mouseout', function(evt) {
			//if($(".mouseover-popup").length>0){
				$(".mouseover-popup").remove();
			//}	
		});
	}, 
	removeMarkers = function() {
		for (i=0;i<plotlayers.length;i++) {
			map.removeLayer(plotlayers[i]);
		}
		plotlayers=[];
	},
	zoomTo = function(lat, lon, zoomLevel){
		var coordinates = new L.LatLng(lat, lon, true);
		map.panTo(coordinates);
		map.setZoom(zoomLevel);
		curPosMarkerLayer.setLatLng(coordinates);
	},
	generateReadableList = function(ids, arrayWithNames){
		var list = "";
		$.each(ids, function(){
			list += arrayWithNames[this]+", ";
		});
		list = list.substring(0, list.length-2);
		return list;
	};

	return {
		initmap: initmap,
		locateUser: locateUser,
		loadMarkers: loadMarkers,
		getOSMAddressHome: getOSMAddressHome		
	}
}

