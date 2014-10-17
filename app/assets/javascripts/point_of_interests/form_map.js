var FormMap = function(){
  var 
  map,
  posMarker,
  newPosPlotlayers=[],
  //TODO
  TEXT_ADDRESSSELECTION = "Wähle eine Adresse aus der Liste aus:",

  posLat,
  posLon,
  newPosAddress,
  //TODO
  addressPlaceholderInTheForm,// = $('#point_of_sale_address'),
  addressResultsPlaceholder, // = $('#locationSearchResults'),

  //PUBLIC METHODS
  initMap = function(lat, lon, address, zoomLevel, mapPlaceholderId) {
    var 
    mapOptions = {center : new L.LatLng(lat, lon), zoom : zoomLevel },
    mapLayer = new L.TileLayer(osmTilesUrl);   
    map = new L.Map(mapPlaceholderId, mapOptions);
    map.addLayer(mapLayer);
    map.whenReady(function () {
      window.setTimeout(function () {
        placeMarker(lat, lon, address, 12, false);
      }.bind(this), 200);
    }, this);
  },
  getOSMAddress = function(data, textStatus, jqXHR){
    // $('#loading-animation').remove();    
    if(data.length > 1){
      addressResultsPlaceholder.html(TEXT_ADDRESSSELECTION+'<ul></ul>');
      console.log("received "+data.length+" Search Results from OSM");
      var validAddressResultArray = new Array();

      var previousAddress = "";
      for(var i = 0; i < data.length; i++){
        //if place's class is NOT in one of the listed
        if($.inArray(data[i].class, [ "highway", "place", "shop", "building"]) == -1 
            //or if it's type is one of the listed, skip the rest of the block and go to the next address
            || $.inArray(data[i].type, [ "bus_stop", "platform", "tertiary", "city", "county"]) > -1) continue; 

        validAddressResultArray.push(data[i]);
        var currentArrayIndex = validAddressResultArray.length -1,
            detailed_address = data[i].display_name;
        if(detailed_address != previousAddress){
          addressResultsPlaceholder.find("ul").append("<li title='"+currentArrayIndex+"'><a href='#'>"+detailed_address+"</a></li>"); 
        }           
        previousAddress = detailed_address;
      }
      addressResultsPlaceholder.show();
      addressResultsPlaceholder.find("li").click(function(){
        var index = this.title;
        handleLocation(validAddressResultArray[index], true); //ifPlaceMarker set to true
      });
    }
    else if(data.length == 1){
      console.log("recieved one Search Result from OSM");
      handleLocation(data[0], false); //ifPlaceMarker set to false
      placeMarker(data[0].lat, data[0].lon, data[0].display_address, ZOOMONMARKERLEVEL, false); 
    }
    else {
      addressResultsPlaceholder.html('<div>No Search Results</div>');
      console.warn("recieved no Search Results from OSM or something went wrong");
    }
  },
  setLocationSearchPlaceholders = function(formPlaceholder, resultsPlaceholder){
    addressPlaceholderInTheForm = formPlaceholder;
    addressResultsPlaceholder = resultsPlaceholder;
  },
  //PRIVATE METHODS
  placeMarker = function(lat, lon, address, zoomLevel, defaultLocation){
    var coordinates = new L.LatLng(lat, lon, true);
    //TODO: refactor/explain if and else, cuz only if works 
    if(typeof(posMarker)=="undefined"){ // if no marker is on the map
        posMarker = new L.Marker(coordinates, {draggable:true});
        posMarker.data="";
        posMarker.addTo(map);        //OR:  map.addLayer(posMarker);
        newPosPlotlayers.push(posMarker);
    } else { // if a marker is already on the map
        posMarker.setLatLng(coordinates);
        console.log("marker was there already");
    }
    map.panTo(coordinates);
    map.setZoom(zoomLevel);
    if(!defaultLocation){
        posLat = lat;
        posLon = lon;    
        displayAddress(address);
    }   
    setMarkerListener(); 
  },
  handleLocation = function(locationData, ifPlaceMarker){
    var 
    address_data = locationData.address,
    short_address,
    road = typeof address_data.road != "undefined" ? address_data.road : "",
    house_number = typeof address_data.house_number != "undefined" ? address_data.house_number : "",
    postcode = typeof address_data.postcode != "undefined" ? address_data.postcode : "",
    city = typeof address_data.city != "undefined" ? address_data.city : "",
    state = typeof address_data.state != "undefined" ? address_data.state : "",
    country = typeof address_data.country != "undefined" ? address_data.country : "";
    if($.inArray(locationData.class, [ "highway", "place"]) > -1){
      short_address = road+" "+house_number+" "+postcode+" "+city+" "+state+" "+country; 
    } else { //building, shop
      short_address = "can not parse the address, insert it manually";
    // console.log(address_data);
    }  
    addressPlaceholderInTheForm.val(short_address);
    var longAddressName = locationData.display_name;
    if (ifPlaceMarker) {
      var lon = locationData.lon,
          lat = locationData.lat;
      placeMarker(lat, lon, longAddressName, ZOOMONMARKERLEVEL-3, false);
    }
  },
  //TODO: gets executed multiple times, so remove previous listener
  setMarkerListener = function(){
    posMarker.on('dragend', function (e) {
      var 
      coords = e.target.getLatLng();
      posLat= coords.lat;
      posLon = coords.lng,
      dataToSend = {
        format: 'json',
        q: "["+posLat +","+ posLon +"]",
        polygon: 0,
        addressdetails: 1
      };
      ajaxCallOSM('http://nominatim.openstreetmap.org/search', dataToSend, function(response){
        handleLocation(response[0], false);
        var address = response[0].display_name;
        displayAddress(address);
      });
    });
  },
  displayAddress = function(address){
    $("#locationSearchResults").html(address);
    newPosAddress = address;
  };
  return{
    initMap: initMap,
    getOSMAddress: getOSMAddress,
    setLocationSearchPlaceholders: setLocationSearchPlaceholders
  }  
}


