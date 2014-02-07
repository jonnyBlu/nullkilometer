function ProfileMap(){
    var map,
        ajaxRequest,
        pos,
        curPosMarkerLayer,
        markersOfTheMap=[],

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

        initMap = function(lat, lon, zoomLevel, placeHolderName){
            var options = {center : new L.LatLng(lat, lon), zoom : zoomLevel };    
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                osmAttribution = 'Map data &copy; 2012 OpenStreetMap contributors',
                osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});    
            var mapLayer = new L.TileLayer(osmUrl);    
            this.map = new L.Map(placeHolderName, options).addLayer(mapLayer);
            this.map.on('locationfound', onLocationFound);
            this.map.on('locationerror', onLocationError);
        },
        markerIcon = L.icon({
            iconUrl: shopTypeIconImageLocation+shopTypeIconImageUrlDefault,
            iconSize:     [30, 43], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [15, 43], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        }),
        onLocationFound = function (e) {

//TODO fix
            curPosMarkerLayer = new L.Marker(e.latlng, {icon: curPosMarkerIcon});
            //console.log(this.map);
            //this.map.addLayer(curPosMarkerLayer);

        },
        onLocationError = function(e) {
            console.log(e.message);
        },
        locateUser = function(zoomLevel){
            this.zoomLevel = zoomLevel;
            this.map.locate({setView : true, maxZoom:  zoomLevel});
        },
        loadMarker = function(data){
            var posTypeId = data.posTypeId;
            //TODO: fix urls
            markerIcon.options.iconUrl = "../"+shopTypeIconImageLocation+shopTypeIconImageUrls[posTypeId];
            var latlon = new L.LatLng(data.lat,data.lon, true),
                marker = new L.Marker(latlon, {icon: markerIcon});
            marker.data=data;
            this.map.addLayer(marker);
            // bindListeners(marker);
            markersOfTheMap.push(marker);
        };
         return{
            initMap: initMap,
            loadMarker: loadMarker,
            locateUser: locateUser
         }   
}

