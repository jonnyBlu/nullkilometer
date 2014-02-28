$(document).ready(function(){
	var map = new HomeMap(),
		buttonSelector = $("#addressLookupContainer #locationSubmit"),
		inputSelector = $("#addressLookupContainer #locationInput"),
		resultsSelector = $("#locationResultPopup"),
		loadFilterListeners = function(){
			$("#mapFilterButton").click(function(){
				$("#mapFilter").toggleClass("open");
				changeText();
				$("#mapFilter").slideToggle("slow");				
			});

			filterTagsBy('productCategory');
			filterTagsBy('shopTypeId');
			filterTagsBy('openingDay');
		},
		changeText = function(){			
			if($("#mapFilter").hasClass("open")){
				var text = $("#buttonTextOpen").html();
				$("#mapFilterButton").html(text);
			} 
			else{
				var text = $("#buttonTextClosed").html();
				$("#mapFilterButton").html(text);
			} 
		},
		filterTagsBy = function(inputName){
			var inputs = $("#mapFilter").find("input[name='"+inputName+"']");
			inputs.each(function(){
				$(this).parent().click(function(){
					$(this).find("input").toggleClass("inactive");
					$(this).find("span").toggleClass("inactive");
					var activeValues = getActiveValues(inputName);
					map.setMarkerOpacity(activeValues, inputName);				
				});
			});
		},
		getActiveValues = function(inputName){
			var array = [];
			var filterInputs = $("#mapFilter").find("input[name="+inputName+"]");
			filterInputs.each(function(){ 
				var active = ($(this).hasClass("inactive")) ? false : true;;
				if(active) {array.push($(this).val());}
			});
			return array;
		};

	$("#addShop").tooltip();

	map.initmap(INITIALLAT, INITIALLON, 3); // around Berlin;
	map.loadMarkers();
	map.locateUser(6);

	registerLocationSearch(buttonSelector, inputSelector, resultsSelector, map.getOSMAddressHome);
	loadFilterListeners();
});



