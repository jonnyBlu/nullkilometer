$(document).ready(function(){
	var 
	map = new HomeMap(),
	filterInputsStatesArray = [],
	buttonSelector = $("#addressLookupContainer #locationSubmit"),
	inputSelector = $("#addressLookupContainer #locationInput"),
	resultsSelector = $("#locationResultPopup"),
	mapFilterPlaceholder, //initializing the variable

	filterTags = function(){
		var activeValues = getActiveValues();
		map.setMarkerOpacity(activeValues);	
	},
	loadFilterListeners = function(){
		$("#mapFilterButton, #find_a_selling_place").click(function(){
			$("#mapFilter").toggleClass("open");
			$("#mapFilter").slideToggle("slow");								
		});

		$("#mapFilterContainer").find("input").parent().click(function(e){
			//relates to "dropdown-menu" element which by default would fire an event which closes the tab
			//http://stackoverflow.com/questions/25089297/twitter-bootstrap-avoid-dropdown-menu-close-on-click-inside
			e.stopPropagation();
			//reading the variable's value every time the user uses the filter
			mapFilterPlaceholder = getMapFilterPlaceholder(); // see which filter (mobile or normal) is currently visible
			var 
			clickedInputElement = $(this).find("input"),
			inputName = $(this).find("input").first().prop("name");

			filterTagsBy(inputName, clickedInputElement);
		});
	},
	filterTagsBy = function(inputName, clickedInputElement){
		//console.log("filteringTagsBy: " + inputName);
		clickedInputElement.toggleClass("inactive");
		clickedInputElement.parent().find("span").toggleClass("inactive");
		if(clickedInputElement.attr("value")=="all")
			toggleActiveInput(inputName);
		
		var activeValues = getActiveValues();
		map.setMarkerOpacity(activeValues);

		var hiddenMapFilterPlaceholder = getHiddenMapFilterPlaceholder();	
		$.each(filterInputsStatesArray, function(){
			if (this.active){
				hiddenMapFilterPlaceholder.find("input[name="+this.type+"][value="+this.index+"]").removeClass("inactive");
				hiddenMapFilterPlaceholder.find("input[name="+this.type+"][value="+this.index+"]").parent().find("span").removeClass("inactive");
			} else {
				hiddenMapFilterPlaceholder.find("input[name="+this.type+"][value="+this.index+"]").addClass("inactive");
				hiddenMapFilterPlaceholder.find("input[name="+this.type+"][value="+this.index+"]").parent().find("span").addClass("inactive");
			}
		});
	},
	toggleActiveInput = function(inputName){
		var 
		inputs = mapFilterPlaceholder.find("input[name='"+inputName+"']"),
		selectAllInput = mapFilterPlaceholder.find("input[name='"+inputName+"'][value='all']"),
		setAllActive = selectAllInput.hasClass("inactive") ? false : true; // select or deselect
		inputs.each(function(){
			//see if setAllActive is true or false
			//set/remove the "inactive" class to all inputs, except the "select all" button
			if($(this).attr("value")!="all"){;
				if (setAllActive) {
					$(this).removeClass("inactive");
					$(this).parent().find("span").removeClass("inactive");
				} else {
					$(this).addClass("inactive");
					$(this).parent().find("span").addClass("inactive");
				}				
			};				
		});
	},
	getActiveValues = function(){
		var 
		activeValues = {};
		filterInputsStatesArray = [];
		$.each(['productCategory', 'shopTypeId', 'openingDay'], function(index, inputName){
			var 
			array = [],
			filterInputs = mapFilterPlaceholder.find("input[name="+inputName+"]");

			filterInputs.each(function(){ 
				var active = ($(this).hasClass("inactive")) ? false : true;
				filterInputsStatesArray.push({ "type" : inputName ,"index": $(this).val(), "active" : active });
				if(active) {array.push($(this).val());}
			});
			activeValues[inputName] = array;			
		});
		return activeValues;
	},
	getMapFilterPlaceholder = function(){
		return $("#mapFilterControls").is(":visible") ? $("#mapFilter") : $("#mapFilterMobile");
	},
	getHiddenMapFilterPlaceholder = function(){
		return $("#mapFilterControls").is(":visible") ?  $("#mapFilterMobile") : $("#mapFilter");
	};

	translateContent();

	map.initmap(INITIALLAT, INITIALLON, 12); // around Berlin;
	map.loadMarkers();
	//map.locateUser(12); //re-activate when there are more tags everywhere
	registerLocationSearch(buttonSelector, inputSelector, resultsSelector, map.getOSMAddress);
	
	mapFilterPlaceholder = getMapFilterPlaceholder();
	//filterTags();
	loadFilterListeners();

});



