var posId;
$(function() {
    var parameters = window.location.search;
    posId = parameters.substr(1).split('=')[1];
    loadProductionPlaces();

});

var loadProductionPlaces = function(){


	loadListeners();
}

var loadListeners = function(){
	$("addNewPop").click(function(){
		
	});
}