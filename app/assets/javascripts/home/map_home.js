var HomeMap = function(){
	var 
	ajaxRequest,
	pos, 
	markersOfTheMap=[],
	curPosMarkerLayer,
	zoomLevel,
	map,
	markerIconWidth = 30,
	markerIconHeight = 43,
	curPosMarkerIconWidth = 40,
	curPosMarkerIconHeight = 40,	
	curPosMarkerIcon = L.icon({
	    iconUrl: userIconImageLocation,
	    iconSize:     [curPosMarkerIconWidth, curPosMarkerIconHeight], // size of the icon
	    shadowSize:   [50, 64], // size of the shadow
	    iconAnchor:   [curPosMarkerIconWidth/2, curPosMarkerIconHeight], // point of the icon which will correspond to marker's location
	    shadowAnchor: [4, 62],  
	    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
	}),
	markerIcon = L.icon({
	    iconUrl: shopTypeIconImageLocation+shopTypeIconImageUrlDefault,
	    iconSize:     [markerIconWidth, markerIconHeight], // size of the icon
	    shadowSize:   [50, 64], // size of the shadow
	    iconAnchor:   [markerIconWidth/2, markerIconHeight], // point of the icon which will correspond to marker's location
	    shadowAnchor: [4, 62],  
	    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
	}),
	initmap = function(lat, lon, zoomLevel){
	    var options = {
	    		center : new L.LatLng(lat, lon), 
	    		zoom : zoomLevel
	    	},     
	    	osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	      	osmAttribution = 'Map data &copy; 2012 OpenStreetMap contributors',
	        osm = new L.TileLayer(osmUrl, {maxZoom: 18, minZoom:2, attribution: osmAttribution}),    
	    	mapLayer = new L.TileLayer(osmUrl);    
	    map = new L.Map('map', options).addLayer(mapLayer);
	    map.on('locationfound', onLocationFound);
		map.on('locationerror', onLocationError);
	},
	locateUser = function(zoomLevel){
		this.zoomLevel = zoomLevel;
		map.locate({setView : true, maxZoom:  zoomLevel});
	},
	loadMarkers = function(){
		callAjax("api/point_of_sales", null, onSuccessLoadMarkers);
	},
	getOSMAddressHome = function (data){
		var resultsSelector = $("#locationResultPopup"),
			resultAmount = data.length;
		resultsSelector.html("<p>"+TEXT_ADDRESSSELECTION+'</p><ul></ul>');
		if(resultAmount > 1){
			//console.log("received "+resultAmount+" Search Results from OSM");
			var resultArr = new Array(),
				previousAddress = "";
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
				var lon = this.title.split(",")[0],
					lat = this.title.split(",")[1],
					chosenAddress = $(this).find("a").html();
				zoomTo(lat, lon, ZOOMONMARKERLEVEL);
				resultsSelector.slideUp();
				$("#mapFilterContainer").slideDown();
			});
		} else if(resultAmount == 1){
			//console.log("recieved one Search Result from OSM");
			// var address = formatAddress(data[0].display_name);
			var address = data[0].display_name;
			zoomTo(data[0].lat, data[0].lon, ZOOMONMARKERLEVEL);
		} else {
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
			markersOfTheMap.push(marker);
		}
	},
	bindListeners = function(marker){
		var posId = marker.data.id,
			posName = marker.data.name,//plot.name;
			posAddress = marker.data.address,
			posType = shopTypeNames[marker.data.posTypeId],
			productCategoryIds_readable = generateReadableList(marker.data.productCategoryIds, productCategoryNames),	
			openingTimes = generateOpeningTimesList(marker.data.openingTimes, weekDayNames),
			address =  marker.data.address;

		marker.on('click', function(evt) {

			//resize all markers' icons to default size
			for (i=0;i<markersOfTheMap.length;i++) {
				resizeMarkerIcon(markersOfTheMap[i], false);
			}
			map.closePopup();

			$("#infoboxContent .title").html(posName);
			$("#infoboxContent .type").html(posType);
			$("#infoboxContent .address").html(posAddress);
			$("#infoboxContent .productCategories").html("Verkauft wird: " + productCategoryIds_readable);
			$("#infoboxContent .openingTimes").html("Öffnungszeiten: " + openingTimes);
			
			$("#infoboxContent #linkToProfilePage").attr("href", "/api/point_of_sales/"+posId+".html");

			var infoBoxContent = $("#hiddenInfoboxContentContainer").html();
			
			marker.bindPopup(infoBoxContent, {className: 'click-popup'}, {closeOnClick: false});
			resizeMarkerIcon(marker, true);
			marker.openPopup();

			$("#map, .leaflet-popup-close-button").click(function(){
				resizeMarkerIcon(marker, false);
			});


		});

/*		marker.on('mouseover', function(evt) {
			//evt.target.closePopup();
		    marker.bindPopup(productCategoryIds_readable, {className: 'mouseover-popup'});
		    marker.openPopup();
		});
		//TODO: only the popup that appeared on mouseover
		marker.on('mouseout', function(evt) {
			//if($(".mouseover-popup").length>0){
				$(".mouseover-popup").remove();
			//}	
		});*/
	}, 
	removeMarkers = function() {
		for (i=0;i<markersOfTheMap.length;i++) {
			map.removeLayer(markersOfTheMap[i]);
		}
		markersOfTheMap=[];
	},
	zoomTo = function(lat, lon, zoomLevel){
		var coordinates = new L.LatLng(lat, lon, true);
		map.setZoom(zoomLevel);
		//callback of setZoom only for this particular event
		map.on('zoomend', function(e) {
			//curPosMarkerLayer.setLatLng(coordinates);
			map.panTo(coordinates);
			map.off('zoomend');
    	});
	},
	generateOpeningTimesList = function(ids, arrayWithNames){
		var list = "<ul>";
		$.each(ids, function(){
			list+="<li><span class='openingTimeDay'>"+arrayWithNames[this.dayId]+"</span>"+this.from+ " - "+ this.to;
			list+="</li>";
		});
		list+="</ul>";
		return list;
	},
	generateReadableList = function(ids, arrayWithNames){
		var list = "<div class='productCategories'>";
		$.each(ids, function(){
			list += "<img class='categoryIcon' src='http://localhost:3000/images/map_icons/food_categories/"+this+".png' title='"+arrayWithNames[this]+"' alt='"+arrayWithNames[this]+"'>";
		});
		list += "</div>";
		return list;
	},
	resizeMarkerIcon = function(marker, enlarge){
		var width = enlarge ? (markerIconWidth + 20) : markerIconWidth; 
		var height = enlarge ? (markerIconHeight + 20) : markerIconHeight;
		var newIcon = marker.options.icon;
		var posTypeId = marker.data.posTypeId;
		newIcon.options.iconUrl = shopTypeIconImageLocation+posTypeId+".png";
		newIcon.options.iconSize[0] = width;
		newIcon.options.iconAnchor[0] = width/2;
		newIcon.options.iconSize[1] = height;
		newIcon.options.iconAnchor[1] = height;
		marker.setIcon(newIcon);
	},
	setMarkerOpacity = function(checkedParameterValues, parameterNamesToCheck){

		for (i=0;i<markersOfTheMap.length;i++) {
			var makeMarkerVisible = false;
			if(parameterNamesToCheck == "productCategory"){
				var parameters = markersOfTheMap[i].data.productCategoryIds;
				$.each(parameters, function(key, value){
					if(jQuery.inArray(value.toString(), checkedParameterValues)>=0)
						makeMarkerVisible = true;		
				});
			}

			else if(parameterNamesToCheck == "shopTypeId"){
				var value = markersOfTheMap[i].data.posTypeId; 
				if(jQuery.inArray(value.toString(), checkedParameterValues)>=0) 
					makeMarkerVisible = true; 
			}

			else if(parameterNamesToCheck == "openingDay"){
				var openingTimes = markersOfTheMap[i].data.openingTimes;
				$.each(openingTimes, function(key, value){
					var openingDay = value.dayId.toString();
					if(jQuery.inArray(openingDay, checkedParameterValues)>=0)
						makeMarkerVisible = true;	
				});
			}
			if(makeMarkerVisible) markersOfTheMap[i].setOpacity(1);
			else{ // reset marker to default size, with infobox closed
				markersOfTheMap[i].setOpacity(0);
				resizeMarkerIcon(markersOfTheMap[i], false);
				markersOfTheMap[i].closePopup();
			}
		}
	};

	return {
		initmap: initmap,
		locateUser: locateUser,
		loadMarkers: loadMarkers,
		getOSMAddressHome: getOSMAddressHome,
		setMarkerOpacity: setMarkerOpacity		
	}
}
