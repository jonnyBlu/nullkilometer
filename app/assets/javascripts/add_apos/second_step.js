var secondStepActions = function(){
	var newPosType;
	var productCategories = [];
	var openingDaysObjectArray = [];

	$('#mainInformationFieldset input[name=shopTypeId]').click(function(){
	   if ($(this).is(':checked'))  newPosType = $(this).val();
	   	if(newPosType == MARKETINDEX){ // market
			loadMarketStallStep();
			$("#marketStallsOverviewRow").removeClass("invisible");
		} else{
			hideMarketStallStep();
			$("#marketStallsOverviewRow").addClass("invisible");
		} 
	});

	openingTimeListeners();

}





