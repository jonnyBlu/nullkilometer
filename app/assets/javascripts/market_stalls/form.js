var ready = function(){

	/** jquery.validate validation methods**/
	var validateOptions = { // initialize the plugin
		errorPlacement: function(error, element) {    	
			if (element.prop("id") == "market_stall_productCategoryIds_0"){
				var containerLabelElement = element.parents().eq(2).find("label").first();
				error.insertAfter(containerLabelElement);
			}
			else { 
				error.insertAfter(element);  // <- the default
			}            
	    },
	    rules: {
	        'market_stall[productCategoryIds][]': {
	            required: true
	        }
	    },
	    messages: {
	    	'market_stall[name]' : {
	    		required: I18n.t("validate.messages.required")
	    	},
	        'market_stall[productCategoryIds][]': {
	            required: I18n.t("validate.messages.check_required")
	        }
	    },
	    submitHandler: function(form) {  
	       if ($(form).valid()) {
	       		alert("valid market form submit");
	           	form.submit(); 
	       }
	       return false; // prevent normal form posting
	    }
	};
    $('#new_market_stall').validate(validateOptions);
    $('.edit_market_stall').validate(validateOptions);
}

$(document).bind('page:change', ready);
$(document).bind('page:load', ready);


