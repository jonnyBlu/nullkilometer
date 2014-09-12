// workaround for turbolink
var ready = function(){
// wth turbolink the followig wouldn't work
//$(document).ready(function () {

	var setFormListeners = function(){
		//(Only for edit page) If one of the time values (we take "from") is not empty, the checkbox for the openingDay is selected
		$(".openingDayContainer").find(".point_of_sale_opening_times_from").each(function(){
				var value = $(this).find("select option:selected").val();
				if( value != ""){

					var id = $(this).find("label").attr("for"),
						checkboxToCheck = $(this).parent().find(".point_of_sale_opening_times_dayId input[type='checkbox']#"+id);
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
	/** jquery.validate validation methods**/
	validateOptions = { // initialize the plugin
		errorPlacement: function(error, element) {    	
			if (element.prop("id") == "point_of_sale_productCategoryIds_0"){
				var containerLabelElement = element.parents().eq(2).find("label").first();
				error.insertAfter(containerLabelElement);
			}
	   		else if (element.prop("name")=="point_of_sale[opening_times_attributes][0][dayId]"){
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
	        'point_of_sale[productCategoryIds][]': {
	            required: true
	//	            maxlength: 2
	        },
	        //this is a workaround for the current input structure of opening times
	        'point_of_sale[opening_times_attributes][0][dayId]' : {
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
	       		alert("valid form submit");
	           	form.submit(); 
	       }
	       return false; // prevent normal form posting
	    }
	},
	validateOpeningDays = function(){
		var checkedDays_counter = 0;
		$.each($(".point_of_sale_opening_times_dayId .checkbox input"), function(){
			var checked = $(this).prop('checked');  // Boolean true
			var checked2 = $(this).is(':checked');  // Boolean true
			if (checked == true){
				checkedDays_counter ++;
			}
		});
		if (checkedDays_counter == 0){
			return false;
		}
		return true;
	},
	validateOpeningTimes = function(parentId){
		//check if opening days are checked as well if a day is checked
		var dayIdCheckbox = $(".openingDayContainer .point_of_sale_opening_times_dayId input[type='checkbox']#"+parentId);
		if (dayIdCheckbox.prop('checked')){
			var val_from=$(".openingDayContainer .point_of_sale_opening_times_from select#"+parentId+" option:selected").val();
			var val_to=$(".openingDayContainer .point_of_sale_opening_times_to select#"+parentId+" option:selected").val();
			if (val_from == "" || val_to == ""){
				return false;
			}
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

	setFormListeners();
	addCustomValidateMethods();
    $('#new_point_of_sale').validate(validateOptions);
    $('.edit_point_of_sale').validate(validateOptions);
}

/**load even if turbolinks enabled**/
$(document).bind('page:change', ready);
$(document).bind('page:load', ready);
//$(document).ready(ready);



