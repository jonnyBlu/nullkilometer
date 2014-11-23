$(document).ready(function(){
	var 
	map = new HomeMap(),
	filterInputsStatesArray = [],
	globalMapFilterContainer = $("#mapFilterContainer"),
	desktopMapFilterPlaceholder = $("#mapFilter"),
	globalLocationSearchButtonPlaceholder = $("#mapFilterContainer #locationSubmit"),
	globalLocationSearchInputPlaceholder = $("#mapFilterContainer #locationInput"),
	locationSearchResultsList = $("#locationResultList"),
	mapFilterPlaceholder, //initializing the variable
	addressLookupContainer,

	loadAddressSearchListeners = function(){
		globalLocationSearchButtonPlaceholder.click(function(e){
			addressLookupContainer = getAddressLookupContainer();
			registerLocationSearch(e, addressLookupContainer.find("#locationInput"), findAddressOnTheMap);
		});
		globalLocationSearchInputPlaceholder.keyup(function(event){
			if(event.keyCode == 13){
				addressLookupContainer = getAddressLookupContainer();
				addressLookupContainer.find("#locationSubmit").click();
			}
		});
	},
	loadFilterListeners = function(){
		$("#find_a_selling_place").click(function(){
			//trigger the button click which opens the filter and trigger the closing of the navbar (on small screens)
			$("#mapFilterButtonMobile").click();
			if($("#headerNavigationButton").is(":visible")) // click the button only if not hidden (means small screen)
				$("#headerNavigationBar #headerNavigationButton").click();
			
		});
		$("#mapFilterButton, #find_a_selling_place").click(function(){
			desktopMapFilterPlaceholder.toggleClass("open");
			desktopMapFilterPlaceholder.slideToggle("slow");								
		});
		globalMapFilterContainer.find("input[type='image']").parent().click(function(e){
			//relates to "dropdown-menu" element visible on mobile devise which by default would fire an event which closes the tab
			//http://stackoverflow.com/questions/25089297/twitter-bootstrap-avoid-dropdown-menu-close-on-click-inside
			e.stopPropagation();
			filterTagsBy($(this).find("input").first().prop("name"), $(this).find("input"));
		});
	},
	filterTagsBy = function(inputName, clickedInputElement){
		//reading the variable's value every time the user uses the filter
		mapFilterPlaceholder = getMapFilterPlaceholder(); // see which filter (mobile or normal) is currently visible
			
		clickedInputElement.toggleClass("inactive");
		clickedInputElement.parent().find("span").toggleClass("inactive");
		if(clickedInputElement.attr("value")=="all")
			toggleActiveFilterInput(inputName);
		
		var activeValues = getActiveFilterValues();
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
	toggleActiveFilterInput = function(inputName){
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
	getActiveFilterValues = function(){
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
	},
	getAddressLookupContainer = function(){
		return $("#mapFilterControls").is(":visible") ? $("#mapFilterControls #addressLookupContainer") : $("#mapFilterMobile #addressLookupContainer");
	},
	findAddressOnTheMap = function(data){

		locationSearchResultsList.html('');
		locationSearchResultsList.html('<p>'+chooseAnAddressText+'</p><ul></ul>');

		if(data.length > 1){
			$("#modalLauncher").click(); //trigger click event on the button opening modal
			var previousAddress = "";
			for(var i = 0; i < data.length; i++){
				var address = data[i].display_name;
				if(address != previousAddress)
					locationSearchResultsList.find("ul").append("<li title='"+data[i].lon+","+data[i].lat+"'><a class='ordinaryLink' href='#'>"+address+"</a></li>"); 
				previousAddress = address;
			}
			locationSearchResultsList.find("li").click(function(){
				var 
					lon = this.title.split(",")[0],
					lat = this.title.split(",")[1],
					chosenAddress = $(this).find("a").html();
				map.zoomTo(lat, lon, ZOOMONMARKERLEVEL);
			});

		} else if(data.length == 1){
			var address = data[0].display_name;
			map.zoomTo(data[0].lat, data[0].lon, ZOOMONMARKERLEVEL);
		} else {
			$("#modalLauncher").click(); //trigger click event on the button opening modal
			locationSearchResultsList.html('<div>No Search Results</div>');
			console.warn("No Search Results received from OSM or something went wrong");
		}
	};

	translateContent();

	map.initmap(INITIALLAT, INITIALLON, 12); // around Berlin;
	map.loadMarkers();
	//map.locateUser(12); //re-activate when there are more tags everywhere

	mapFilterPlaceholder = getMapFilterPlaceholder();
	loadAddressSearchListeners();
	loadFilterListeners();

});



