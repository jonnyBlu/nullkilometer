$(document).ready(function(){
	var map = new HomeMap(),
		buttonSelector = $("#addressLookupContainer #locationSubmit"),
		inputSelector = $("#addressLookupContainer #locationInput"),
		resultsSelector = $("#locationResultPopup"),
		loadFilterListeners = function(){
			$("#mapFilterButton").click(function(){
				$("#mapFilter").toggleClass("open");
				$("#mapFilter").slideToggle(changeText);				
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
				$(this).click(function(){
					console.log($(this).parent().find("img.icon"));
					$(this).parent().find("img.icon").toggleClass("inactive");
					var checkedValues = getCheckedValues(inputName);
					map.setMarkerOpacity(checkedValues, inputName);				
				});
			});
		},
		getCheckedValues = function(inputName){
			var array = [];
			var filterInputs = $("#mapFilter").find("input[name="+inputName+"]");
			filterInputs.each(function(){ ;
				if(this.checked) {array.push($(this).val());}
			});
			return array;
		};

	map.initmap(INITIALLAT, INITIALLON, 3); // around Berlin;
	map.locateUser(6);
	map.loadMarkers();

	registerLocationSearch(buttonSelector, inputSelector, resultsSelector, map.getOSMAddressHome);
	loadFilterListeners();
});



