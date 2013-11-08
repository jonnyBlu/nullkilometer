$(document).ready(function(){
	initmap(INITIALLAT, INITIALLON, 9); // around Berlin;
	locateUser();
	loadMarkers();
	loadFilterListeners();
	var buttonSelector = $("#addressLookupContainer #locationSubmit");
	var inputSelector = $("#addressLookupContainer #locationInput");
	var resultsSelector = $("#locationResultPopup");
	registerLocationSearch(buttonSelector, inputSelector, resultsSelector, getOSMAddressHome);
});


function loadFilterListeners(){
	$("#mapFilterButton").click(function(){
		$("#mapFilter").slideToggle();//toggleClass("hidden");
	});

	var productCategoryFilterInputs = $("#mapFilter").find("input[name='productCategory']");
	productCategoryFilterInputs.each(function(){
		var inp = $(this);
		inp.click(function(){
			var checkedProductCategories = getCheckedValues("productCategory");
			for (i=0;i<plotlayers.length;i++) {
				var prodCat = plotlayers[i].data.productCategoryIds;
				var atLeastOneIsChecked = false;
				$.each(prodCat, function(key, value){
					if(jQuery.inArray(value, checkedProductCategories)>=0)
						atLeastOneIsChecked = true;					
				});
				if(atLeastOneIsChecked) plotlayers[i].setOpacity(1);
				else  
					plotlayers[i].setOpacity(0);
			}
		});
	});

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
	});

}




var getCheckedValues = function(inputName){
	var array = [];
	var productCategoryFilterInputs = $("#mapFilter").find("input[name="+inputName+"]");
	productCategoryFilterInputs.each(function(){ 
		if(this.checked) array.push($(this).val());
	});
	return array;
}
