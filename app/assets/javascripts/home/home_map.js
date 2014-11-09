var HomeMap = function(){
	var 
	ajaxRequest,
	pos, 
	markersOfTheMap=[],
	curPosMarkerLayer,
	zoomLevel,
	map,
	markerIconWidth = 40,
	markerIconHeight = 56,
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
	    mapLayer = new L.TileLayer(osmTilesUrl);    
	    map = new L.Map('map', options).addLayer(mapLayer);
	    map.on('locationfound', onLocationFound);
		map.on('locationerror', onLocationError);
	},
	locateUser = function(zoomLevel){
		this.zoomLevel = zoomLevel;
		map.locate({setView : true, maxZoom:  zoomLevel});
	},
	loadMarkers = function(){
		//map.spin(true); 
		callAjax("/"+I18n.currentLocale()+"/point_of_sales", null, onSuccessLoadMarkers);
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
			markerIcon.options.iconUrl = shopTypeMapMarkerImageUrls[shopTypeId];
			var 
			latlon = new L.LatLng(pos[i].lat,pos[i].lon, true),
			marker = new L.Marker(latlon, {icon: markerIcon});
			marker.data=pos[i];
			map.addLayer(marker);
			bindListeners(marker);
			markersOfTheMap.push(marker);
		}
	},
	bindListeners = function(marker){
		marker.on('click', function(evt) {	
			var infoBoxContent = typeof marker.getPopup() == "undefined" ? buildInfoboxHtml(marker) : marker.getPopup().getContent();
			//a workaround, cuz if a popup is still bound from the previous click (but invisible), 
			//it opens but remains invisible
			marker.unbindPopup();
			marker.bindPopup(infoBoxContent, {className: 'click-popup'}, {closeOnClick: false});
			marker.openPopup();
		});
		marker.on('popupopen', function(){
			resizeMarkerIcon(marker, true);	
		});
		marker.on('popupclose', function(){
			resizeMarkerIcon(marker, false);
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
	buildInfoboxHtml= function(marker){
		var posId = marker.data.id,
			posName = marker.data.name,//plot.name;
			posAddress = marker.data.address,
			posType = shopTypeNames[marker.data.posTypeId],
			productCategoryIds_readable = generateReadableList(marker.data.productCategoryIds, productCategoryNames),	
			openingTimes = generateOpeningTimesList(marker.data.openingTimes, weekDayNames),
			address =  marker.data.address,
			selfUrl = marker.data.self;

		var htmlContent = '<div id="infoboxContent">' +
			'<div class="infoHeader">' +
				'<ul>' +
					'<li class="type">'+posType+'</li>' +
				  	'<li class="'+ posName+'" title="shop">'+posName+'</li>' +
				'</ul>' +
			'</div>' +
			'<!--<div class="posLocationDegree">TODO: locality degree</div>-->' +
			'<div class="productCategories">'+productCategoryIds_readable+'</div>' +
			'<div class="address">'+posAddress+'</div>' +
			'<div class="openingTimes">'+openingTimes+'</div>' +
			'<div class="footer"><a href="'+selfUrl+'" target="_blank" class="ordinaryLink" id="linkToProfilePage">'+moreInfoLinkName+'</a></div>' +
		'</div>';
		return htmlContent;
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
		map.panTo(coordinates);
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
		var list = "";
		$.each(ids, function(){
			list += "<img class='categoryIcon' src='"+categoryIconImageUrls[this]+"' title='"+arrayWithNames[this]+"' alt='"+arrayWithNames[this]+"'>";
		});
		return list;
	},
	resizeMarkerIcon = function(marker, enlarge){
		var 
		width = enlarge ? (markerIconWidth + 20) : markerIconWidth,
		height = enlarge ? (markerIconHeight + 20) : markerIconHeight,
		newIcon = marker.options.icon,
		posTypeId = marker.data.posTypeId;
		newIcon.options.iconUrl = shopTypeMapMarkerImageUrls[posTypeId];
		newIcon.options.iconSize[0] = width;
		newIcon.options.iconAnchor[0] = width/2;
		newIcon.options.iconSize[1] = height;
		newIcon.options.iconAnchor[1] = height;
		marker.setIcon(newIcon);
	},
	setMarkerOpacity = function(checkedParameters){//, checkedParameterValues, parameterNamesToCheck){
		for (i=0;i<markersOfTheMap.length;i++) {
			var 
			makeMarkerVisible1 = false,
			makeMarkerVisible2 = false,
			makeMarkerVisible3 = false;
			$.each(checkedParameters, function(key, values){ // loops 3 times
				if(key == "productCategory"){
					var parameters = markersOfTheMap[i].data.productCategoryIds;
					//OR FILTER
					$.each(parameters, function(key, value){
						//looks if places product categories are within the requested product categories
						// will return -1 if not found
						if(jQuery.inArray(value.toString(), values)>=0)
							makeMarkerVisible1 = true;		
					});
				}
				else if(key == "shopTypeId"){
					var value = markersOfTheMap[i].data.posTypeId; 
					if(jQuery.inArray(value.toString(), values)>=0) 
						makeMarkerVisible2 = true; 

				}
				else if(key == "openingDay"){
					var openingTimes = markersOfTheMap[i].data.openingTimes;
					$.each(openingTimes, function(key, value){
						var openingDay = value.dayId.toString();
						if(jQuery.inArray(openingDay, values)>=0)
							makeMarkerVisible3 = true;	
					});
				}
			});
			if(makeMarkerVisible1 && makeMarkerVisible2 && makeMarkerVisible3) {
				map.addLayer(markersOfTheMap[i]);
			}
			else{ 
				// reset marker to default size, with infobox closed
				resizeMarkerIcon(markersOfTheMap[i], false);
				markersOfTheMap[i].closePopup();
				//https://github.com/Leaflet/Leaflet/issues/4
				map.removeLayer(markersOfTheMap[i]);
			}
		}
	};
	return {
		initmap: initmap,
		locateUser: locateUser,
		loadMarkers: loadMarkers,
		zoomTo: zoomTo,
		setMarkerOpacity: setMarkerOpacity		
	}
}

