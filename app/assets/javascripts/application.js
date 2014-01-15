// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs

//= require jquery.ui.all

// Loads all Bootstrap javascripts
//= require bootstrap
//= require jquery.timepicker.js
//= require leaflet
//= tree

var INITIALLAT = 52.5233;
var INITIALLON = 13.4127;
var ZOOMONMARKERLEVEL = 17;
var TEXT_ADDRESSSELECTION = "Wähle eine Adresse aus der Liste aus:";

var shopTypeNames = ["Markt", "Supermarkt", "Laden", "Kiosk", "Bauernhofladen"];
var productCategoryNames = ["Milchprodukte", "Obst und Gemüse", "Fisch", "Fleisch", "Eier", "Brot", "Konserven", "Getrocknete Waren"];
var weekDayNames = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
var MARKETINDEX = 1;

var iconImageLocation =  "../images/map_icons/";
var productCategoryIconImageLocation = iconImageLocation + "food_categories/";
var productTypeIconImageUrls = ["milk.png", "vegetables.png", "fish.png", "meat.png", "eggs.png", "conserves.png", "bread.png", "dried.png"];

var shopTypeIconImageLocation = iconImageLocation + "shop_categories/";
var shopTypeIconImageUrls = ["0.png", "1.png", "2.png", "3.png", "4.png"];

var shopTypeIconImageUrlDefault = "default.png";
var userIconImageLocation = "../images/map_icons/user.png";

var callAjax = function(url, dataToSend, onSuccess){
    $.ajax({
        type: "GET",
        dataType: "json",
        data: dataToSend,
        url: url,
        success: onSuccess,
        error: function(xhr, error){
            console.debug(xhr); console.debug(error);
        }
    }).done(function() {
    });
}

var ajaxCallOSM = function(url, dataToSend, onSuccessFunction){
	$.ajax({
		type: 'GET',
		url: url,
		data: dataToSend,
		dataType: 'json',
		success: onSuccessFunction,
		error: function(jqXHR, textStatus, errorThrown){
			$('#locationSearchResults').html('<div>Something went wrong while communicating with nomination.openstreetmaps.org</div>');
			console.warn("searching in OSM DB failed: "+textStatus+": "+jqXHR+" - "+errorThrown);
		}
	});
}



var registerLocationSearch = function(buttonSelector, inputSelector, resultsSelector, onSuccessFunction){

	buttonSelector.click(function(event){
		event.preventDefault();
		resultsSelector.html('');
		var input = inputSelector.val();
		if(input.trim() != ""){
			// $('#newPosMap').append('<img alt="Loading" id="loading-animation" src="//'+window.location.host+'/assets/ajax-loader.gif" />');
			var dataToSend = {
				format: 'json',
				q: input,
				polygon: 0,
				addressdetails: 0
			};
			ajaxCallOSM('http://nominatim.openstreetmap.org/search', dataToSend, onSuccessFunction);
		}
		inputSelector.val("");
	});
	inputSelector.keyup(function(event){
		if(event.keyCode == 13){
			buttonSelector.click();
		}
	});

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

	$.each($('input[name=openingDay]'), function(){
		if($(this).attr("checked")=="checked"){
			$(this).parent().parent().parent().find("input.timePickerInput").each(function(){
				$(this).attr("disabled", false);
			});
		}
	});


    $('input[name=openingDay]').change(function (event) {
    	var checked = this.checked;
   		if(!checked) $('#allDaysCheckbox').prop("checked", false);

   		$(this).parent().parent().parent().find("input.timePickerInput").each(function(){
			$(this).attr("disabled", !checked);
			if(!checked) $(this).val("");
		});
    });
}



var requiredFieldsFilled = function(containerName){
	var filled =  false;
	if($(containerName).find('.requiredField').length <= 0) filled = true;
	$(containerName).find('.requiredField').each(function(){
		var $this 		= $(this);
		var name = $this.attr("name");
		var valueLength = jQuery.trim($this.val()).length;				
		if(valueLength == ''){
			$this.css('background-color','#FFEDEF');
			$(containerName+" label[for="+name+"]").addClass("invalidLabel");
		}
		else{
			filled = true;
			$this.css('background-color','#FFFFFF');	
			$(containerName+" label[for="+name+"]").removeClass("invalidLabel");
		}
	});
	return filled;
}


//validation methods

var isRequiredListFilled = function(container, propertyname){
    var filled = true;
    if(container.find("input[name="+propertyname+"]:checked").length <= 0){
            container.find("label[for="+propertyname+"]").addClass("invalidLabel");
            filled = false;
        } else container.find("label[for="+propertyname+"]").removeClass("invalidLabel");
    return filled;
}


//global form reading functions

var readMarketStallInformation = function(container){
    var newStallInformation = {};
    var productCategories = [];
    var stallInformationInputs = container.find(" :input");

	var descriptionVal = container.find("textarea").val()
    if(descriptionVal!=""){
		newStallInformation["description"] = descriptionVal;
    }
    stallInformationInputs.each(function(){
        var n = this;
        if (n.type=="text"){
            if($(n).val()!= "")
                newStallInformation[n.name] = $(n).val();                    
        } else if (n.type == "checkbox"){
            if(n.checked){
                if(n.name == "productCategory")
                    productCategories.push($(n).val());
            }
        }
    });
    newStallInformation["products"] = productCategories;
    console.log(newStallInformation);
    return newStallInformation;
}