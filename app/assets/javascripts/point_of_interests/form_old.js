$(function(){
	//TODO: only if point of sales/interests and not market stall
	var displayMap = function(){
		var 
		map = new FormMap(),
		isEditMode = (parameters.toLowerCase().indexOf("edit") >= 0) ? true : false,
		mapPlaceholderId = 'formPosMap',
		buttonSelector = $('#addressLookupContainer #locationSubmit'),
    inputSelector = $('#addressLookupContainer #locationInput'),
    addressPlaceholderInTheForm = $('#point_of_sale_address'), 
    addressResultsPlaceholder =  $('#locationSearchResults'),
    TEXT_ADDRESS_SELECTION = I18n.t("map.messages.select_one_address"), 

    getOSMAddress = function(data, textStatus, jqXHR){ 
	    if(data.length > 1){
	      addressResultsPlaceholder.html(TEXT_ADDRESS_SELECTION+'<ul></ul>');
	    //  console.log("received "+data.length+" Search Results from OSM");
	      var validAddressResultArray = new Array();

	      var previousAddress = "";
	      for(var i = 0; i < data.length; i++){
	        //if place's class is NOT in one of the listed
	        if($.inArray(data[i].class, [ "highway", "place", "shop", "building"]) == -1 
	          //or if it's type is one of the listed, skip the rest of the block and go to the next address
	          || $.inArray(data[i].type, [ "bus_stop", "platform", "tertiary", "city", "county"]) > -1) continue; 
	        validAddressResultArray.push(data[i]);
	        var 
	        currentArrayIndex = validAddressResultArray.length -1,
	        detailed_address = data[i].display_name;
	        if(detailed_address != previousAddress){
	          addressResultsPlaceholder.find("ul").append("<li title='"+currentArrayIndex+"'><a href='#' class='ordinaryLink'>"+detailed_address+"</a></li>"); 
	        }           
	        previousAddress = detailed_address;
	      }
	      addressResultsPlaceholder.show();
	      addressResultsPlaceholder.find("li").click(function(){
	        var index = this.title;
	        map.handleLocation(validAddressResultArray[index], true); //ifPlaceMarker set to true
	      });
	    }
	    else if(data.length == 1){
	      console.log("recieved one Search Result from OSM");
	      map.handleLocation(data[0], true); 
	    }
	    else {
	      addressResultsPlaceholder.html('<div>'+I18n.t("map.messages.no_results")+'</div>');
	      console.warn("recieved no Search Results from OSM or something went wrong");
	    }
	  };

		if (isEditMode){ //IF EDIT - get coordinates of the pos
			var 
			posId = parameters.split('/')[parameters.split('/').length-2].split('.')[0],
			onSuccessReadPosInformation = function(response){
	        var posInformation = response.pointOfSale;
	        map.initMap(posInformation.lat, posInformation.lon, posInformation.address, ZOOMONMARKERLEVEL-3, mapPlaceholderId);
	    };
			callAjax("/point_of_sales/"+posId, null, onSuccessReadPosInformation); 
		} else {//IF NEW - centralize the map around a default position
		  map.initMap(INITIALLAT, INITIALLON, '', 9, mapPlaceholderId); // around Berlin
		}
		map.setLocationSearchPlaceholders(addressPlaceholderInTheForm, addressResultsPlaceholder);
	  setLocationSearchListners(buttonSelector, inputSelector, addressResultsPlaceholder, getOSMAddress);
	};

	var setFormListeners = function(){
		//(Only for edit page) If one of the time values (we take "from") is not empty, the checkbox for the openingDay is selected
		$(".openingDayContainer").find(".point_of_sale_opening_times_from").each(function(){
			var value = $(this).find("select option:selected").val();
			if( value != ""){
				var 
				id = $(this).find("label").attr("for"),
				checkboxToCheck = $(this).parent().find(".point_of_sale_opening_times_day input[type='checkbox']#"+id);
//				checkboxToCheck.prop("checked",true).trigger("change"); // does not work!!!!
				checkboxToCheck.prop("checked",true);
				checkboxToCheck.parents().eq(3).removeClass("grayedOut");
				checkboxToCheck.parents().eq(3).find(".point_of_sale_opening_times_from, .point_of_sale_opening_times_to").removeClass("hidden");
			}
		});

		//change style on OpeningTimes checkbox change
		$(".openingDayContainer input[type='checkbox']").change(function() {
	  	$(this).parents().eq(3).toggleClass("grayedOut");
	  	if (!$(this).parents().eq(3).hasClass("grayedOut")){
	  		$(this).parents().eq(3).find(".point_of_sale_opening_times_from, .point_of_sale_opening_times_to").removeClass("hidden");
	  		$(this).parents().eq(3).find(".error").removeClass("hidden");
	  	} else {
	  		$(this).parents().eq(3).find(".point_of_sale_opening_times_from, .point_of_sale_opening_times_to").addClass("hidden");
	  		$(this).parents().eq(3).find(".error").addClass("hidden");
	  	}
		});
	},
	//jquery.validate validation methods
	validateOptions = { // initialize the plugin
		errorPlacement: function(error, element) {    	
			if (element.prop("id") == "point_of_sale_productCategoryIds_0"){
				var containerLabelElement = element.parents().eq(2).find("label").first();
				error.insertAfter(containerLabelElement);
			}
	   	else if (element.prop("name")=="point_of_sale[opening_times_attributes][0][day]"){
				var containerLabelElement = element.parents().eq(4).find("label").first();
				error.insertAfter(containerLabelElement);
			} 
			else if(element.prop("name").indexOf('point_of_sale[opening_times_attributes]') == 0 && 
																										element.prop("name").indexOf('[from]') > 0){
				var containerLabelElement = element.parents().eq(2).find(".point_of_sale_opening_times_to");
				error.insertAfter(containerLabelElement);
			}
			else { 
				error.insertAfter(element);  // <- the default
			}            
	  },
    rules: {
    	'point_of_sale[posTypeId]': {
      	required: true
      },
      'point_of_sale[status_id]': {
      	required: true
      }	        ,
      'point_of_sale[productCategoryIds][]': {
          required: true
//	            maxlength: 2
      },
      //this is a workaround for the current input structure of opening times
      'point_of_sale[opening_times_attributes][0][day]' : {
      	openingDays: true
      }, 
      //this is to check the openingTimes if an openingDay is selected
      'point_of_sale[opening_times_attributes][0][from]': {
       	openingTimes: true
      },
      'point_of_sale[opening_times_attributes][1][from]': {
       	openingTimes: true
      },
      'point_of_sale[opening_times_attributes][2][from]': {
       	openingTimes: true
      },
      'point_of_sale[opening_times_attributes][3][from]': {
       	openingTimes: true
      },
      'point_of_sale[opening_times_attributes][4][from]': {
       	openingTimes: true
      },
      'point_of_sale[opening_times_attributes][5][from]': {
       	openingTimes: true
      },
      'point_of_sale[opening_times_attributes][6][from]': {
       	openingTimes: true
      }
    },
    messages: {
    	'point_of_sale[name]' : {
    		required: I18n.t("validate.messages.required")
    	},
    	'point_of_sale[address]' : {
    		required: I18n.t("validate.messages.required")
    	},
    	'point_of_sale[status_id]': {
        	required: I18n.t("validate.messages.select_required")
        },
    	'point_of_sale[posTypeId]': {
        	required: I18n.t("validate.messages.select_required")
      },
      'point_of_sale[productCategoryIds][]': {
          required: I18n.t("validate.messages.check_required")
//	            maxlength: "Check no more than {0} boxes"
      }
    },
    submitHandler: function(form) {  
     if ($(form).valid()) {
     		alert("Valid form submit");
         	form.submit(); 
     }
     return false; // prevent normal form posting
    }
	},
	validateOpeningDays = function(){
		return $(".point_of_sale_opening_times_day .checkbox input:checked").length > 0 ;
	},
	validateOpeningTimes = function(parentId){
		//check if opening days are checked as well if a day is checked
		var dayIdCheckbox = $(".openingDayContainer .point_of_sale_opening_times_day input[type='checkbox']#"+parentId);
		if (dayIdCheckbox.prop('checked')){
			var 
			val_from=$(".openingDayContainer .point_of_sale_opening_times_from select#"+parentId+" option:selected").val(),
			val_to=$(".openingDayContainer .point_of_sale_opening_times_to select#"+parentId+" option:selected").val();
			if (val_from == "" || val_to == "") return false;
			return true;
		}  
	},
	//additional custom validate methods
	addCustomValidateMethods = function(){
		jQuery.validator.addMethod("openingDays", function(value, element) {
			return validateOpeningDays();	
		}, I18n.t("validate.messages.opening_day_required"));

		jQuery.validator.addMethod("openingTimes", function(value, element) {
			return validateOpeningTimes($(element).attr("id"));	
		}, I18n.t("validate.messages.opening_times_required"));
	};

	var parameters = window.location.pathname;
	if (parameters.toLowerCase().indexOf("point_of_sales") >= 0 || parameters.toLowerCase().indexOf("point_of_production") < 0 ){		
		displayMap();
	};
	setFormListeners();
	addCustomValidateMethods();
  $('#new_point_of_sale').validate(validateOptions);
  $('.edit_point_of_sale').validate(validateOptions);
});




