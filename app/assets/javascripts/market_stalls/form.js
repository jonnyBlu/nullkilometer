$(function(){
		var formValidator = new FormValidator();
		formValidator.addCustomValidateMethods();

	  $('#new_market_stall').validate(formValidator.validateOptions_marketStall);
    $('.edit_market_stall').validate(formValidator.validateOptions_marketStall);
});



