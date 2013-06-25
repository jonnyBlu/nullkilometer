var secondStepActions = function(){
	var newPosType;
	var productCategories = [];
	var openingDaysObjectArray = [];

	$('#mainInformationFieldset input[name=shopType]').click(function(){
	   if ($(this).is(':checked'))  newPosType = $(this).val();
	   	if(newPosType == "1"){ // market
			loadMarketStallStep();
		} else hideMarketStallStep();
	});

	openingTimeListeners();

}


// read all checked fields 
var openingTimeListeners = function(){

	var timepickerOptions = { 
		'step': 30, 
		'timeFormat': 'H:i' , 
		'minTime': '06:00',
		'maxTime': '00:00'
	};

	$('.timePickerInput').timepicker(timepickerOptions);



    $('#allDaysCheckbox').change(function (event) {
		var selected = this.checked;
       	$('input[name=openingDay]').each(function () { 
       		if(this.checked != selected)
       			$(this).click();
       });
    });
    $('input[name=openingDay]').change(function (event) {
    	var checked = this.checked;
   		if(!checked) $('#allDaysCheckbox').prop("checked", false);
   		$(this).parent().parent().parent().find("input.timePickerInput").each(function(){
			$(this).attr("disabled", !checked);
		});

    });
}



