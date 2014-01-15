$(document).ready(function(){
	var map = new HomeMap(),
		buttonSelector = $("#addressLookupContainer #locationSubmit"),
		inputSelector = $("#addressLookupContainer #locationInput"),
		resultsSelector = $("#locationResultPopup"),
		loadFilterListeners = function(){
			$("#mapFilterButton").click(function(){
				$("#mapFilter").slideToggle();
			});

			var productCategoryFilterInputs = $("#mapFilter").find("input[name='productCategory']");
			productCategoryFilterInputs.each(function(){
				var inp = $(this);
				inp.click(function(){
					var checkedProductCategories = getCheckedValues("productCategory");
					//console.log(checkedProductCategories);
					map.setMarkerOpacity(checkedProductCategories, "productCategory");				
				});
			});
		},
		getCheckedValues = function(inputName){
			var array = [];
			var productCategoryFilterInputs = $("#mapFilter").find("input[name="+inputName+"]");
			productCategoryFilterInputs.each(function(){ ;
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




/*
	var shopTypeFilterInputs = $("#mapFilter").find("input[name='shopTypeId']");
	shopTypeFilterInputs.each(function(){
		var inp = $(this);
		inp.click(function(){
			for (i=0;i<plotlayers.length;i++) {
				if(plotlayers[i].data.shopTypeId == inp.val()){
					if(this.checked) plotlayers[i].setOpacity(1);
					else plotlayers[i].setOpacity(0);	
				}	
			}
		});
	});


	var openingDayFilterInputs = $("#mapFilter").find("input[name='openingDay']");
	openingDayFilterInputs.each(function(){
		var inp = $(this);
		inp.click(function(){
			var checkedOpeningDays = getCheckedValues("openingDay");
			for (i=0;i<plotlayers.length;i++) {
				var openingDays = plotlayers[i].data.openOn;
				var atLeastOneIsChecked = false;
				$.each(openingDays, function(key, value){
					if(jQuery.inArray(value, checkedOpeningDays)>=0)
						atLeastOneIsChecked = true;					
				});
				if(atLeastOneIsChecked) plotlayers[i].setOpacity(1);
				else  
					plotlayers[i].setOpacity(0);
			}
		});
	});*/


