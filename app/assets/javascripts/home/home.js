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
		loadHomeTextBoxListeners = function(){
			//TODO: remove previous listeners
			$("#linkToHomepageText").click(function(){
				$("#homePageText").toggleClass("up");
				
				$('#mapContainer').click(function() {
					$("#homePageText").removeClass("up");
					$("#mapContainer").unbind("click");
				});
				$('#homePageText').click(function(){
					$("#homePageText").addClass("up");
					$("#homePageText").unbind("click");
				});
			});
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
					var activeValues = getActiveValues();
					map.setMarkerOpacity(activeValues);				
				});
			});
		},
		getActiveValues = function(){
			var activeValues = {};
			$.each(['productCategory', 'shopTypeId', 'openingDay'], function(index, inputName){
				var array = [];
				var filterInputs = $("#mapFilter").find("input[name="+inputName+"]");
				filterInputs.each(function(){ 
					var active = ($(this).hasClass("inactive")) ? false : true;;
					if(active) {array.push($(this).val());}
				});
				activeValues[inputName] = array;
			});
			return activeValues;
		};
	//not used?
	$("#addShop").tooltip();

	map.initmap(INITIALLAT, INITIALLON, 9); // around Berlin;
	map.loadMarkers();
	map.locateUser(12);

	registerLocationSearch(buttonSelector, inputSelector, resultsSelector, map.getOSMAddress);
	loadFilterListeners();

	loadHomeTextBoxListeners();
});



