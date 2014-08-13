$(document).ready(function(){
	var map = new HomeMap(),
		buttonSelector = $("#addressLookupContainer #locationSubmit"),
		inputSelector = $("#addressLookupContainer #locationInput"),
		resultsSelector = $("#locationResultPopup"),
		loadFilterListeners = function(){
			$("#mapFilterButton, #closeButtonFilter").click(function(){
				$("#mapFilter").toggleClass("open");
				changeText();
				$("#mapFilter").slideToggle("slow");				
			});

			filterTagsBy('productCategory');
			filterTagsBy('shopTypeId');
			filterTagsBy('openingDay');
		},
		loadHomeTextBoxListeners = function(){
			var i=0;
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
				//collapsing the button back (only if visible otherwise has the animation has problems)
				if($('.navbar-toggle').is(':visible')) {
    				$('.navbar-toggle').trigger( "click" );
				}	
				
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
					if($(this).find("input").attr("value")=="all"){
						$(this).find("input").toggleClass("inactive");
						toggleActiveInput(inputName);
					} else{
						$(this).find("input").toggleClass("inactive");
						$(this).find("span").toggleClass("inactive");
					}
					var activeValues = getActiveValues();
					map.setMarkerOpacity(activeValues);				
				});
			});
		},
		toggleActiveInput = function(inputName){
			var inputs = $("#mapFilter").find("input[name='"+inputName+"']");
			var selectAllInput = $("#mapFilter").find("input[name='"+inputName+"'][value='all']");
			var setAllActive = selectAllInput.hasClass("inactive") ? false : true; // select or deselect
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

	map.initmap(INITIALLAT, INITIALLON, 12); // around Berlin;
	map.loadMarkers();
	//map.locateUser(12); //re-activate when there are more tags everywhere

	registerLocationSearch(buttonSelector, inputSelector, resultsSelector, map.getOSMAddress);
	loadFilterListeners();

	loadHomeTextBoxListeners();
});



