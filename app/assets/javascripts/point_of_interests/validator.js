var FormValidator = function(){
	/** jquery.validate validation methods**/
	var validateOptions = { // initialize the plugin
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

			console.log("adding custom validator options: days");

			return validateOpeningDays();	
		}, I18n.t("validate.messages.opening_day_required"));

		jQuery.validator.addMethod("openingTimes", function(value, element) {

			console.log("adding custom validator options: times");

			return validateOpeningTimes($(element).attr("id"));	
		}, I18n.t("validate.messages.opening_times_required"));
	};
	return{
		validateOptions: validateOptions,
		addCustomValidateMethods: addCustomValidateMethods
	}
}
