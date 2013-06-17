
$(document).ready(function(){
	initmap();
	locateUser();
	loadMarkers();
	loadFilterListeners();
});

function loadFilterListeners(){
	$("#mapFilterButton").click(function(){
		$("#mapFilter").slideToggle();//toggleClass("hidden");
	});
}
