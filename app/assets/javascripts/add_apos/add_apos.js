$(function() {
	addAPos();	
});

var addAPos = function(){
	loadForm();
	firstStepActions();
	secondStepActions();
}


var loadForm = function(){

	var fieldsetCount = $('#formElem').children().length;
	var current 	= 1;
    
	/*
	sum and save the widths of each one of the fieldsets
	set the final sum as the total width of the steps element
	*/
	var stepsWidth	= 0;
    var widths 		= new Array();
	$('#steps .step').each(function(i){
        var $step 		= $(this);
		widths[i]  		= stepsWidth;
        stepsWidth	 	+= $step.width();
    });
	$('#steps').width(stepsWidth);

	/*
	IE solution
	*/
	$('#formElem').children(':first').find(':input:first').focus();	
	$('#navigation').show();
	

	/*
	when clicking on a navigation link 
	the form slides to the corresponding fieldset
	*/
    $('#navigation a').bind('click',function(e){
    	if($(this).attr("id") == "overviewTab"){
    		generateOverview();
    		return;
    	}
		var $this	= $(this);
		var clickedStepNumber = $this.parent().index() + 1;

		var mainInfoToBeSaved = true;

		if(!$(this).hasClass("available")){
			if((current <= 2 && mainInfoToBeSaved)){
				if(!validateStep(2)) { // no errors
					$(this).addClass("available");
				} 
			}else 
				$(this).addClass("available");
		} 
	 	goToStep($this);
		e.preventDefault();
    });
	
	/*
	clicking on the button (at the end of each fieldset), makes the form
	slide to the next step
	*/
	$('#addAPosForm > fieldset').each(function(){
		var $fieldset = $(this);
		$(this).find(".toTheNextStepButton").click(function(e){
			$('#navigation li:nth-child(' + (parseInt(current)+1) + ') a').click();
			e.preventDefault();
		});
	});
	


	$("#addresseBestimmenLink").click(function(e){
		$('#navigation li:nth-child(1) a').click();
	 	e.preventDefault();
	});

	var goToStep = function($this){
		if(!$this.hasClass("available")) return;

		var prev = current;
		$this.closest('ul').find('li').removeClass('selected');
        $this.parent().addClass('selected');
		current = $this.parent().index() + 1;


		var currentWidth = widths[current-1];
		/*
		slide to the next or to the corresponding fieldset
		*/

		$('#steps').stop().animate({
            marginLeft: '-' + currentWidth  + 'px'
        },500,function(){
			if(current == fieldsetCount)
				validateSteps();
			else
				if(prev == 1 || prev == 3) validateStep(prev);
			$('#formElem').children(':nth-child('+ parseInt(current) +')').find(':input:first').focus();	
		});


	}



	/*
	validates errors on all the fieldsets
	records if the Form has errors in $('#formElem').data()
	*/
	function validateSteps(){
		var FormErrors = false;
		for(var i = 1; i < fieldsetCount; ++i){
			var error = validateStep(i);
			if(error == -1)
				FormErrors = true;
		}
		$('#formElem').data('errors',FormErrors);	
	}
	
	/*
	validates one fieldset
	and returns -1 if errors found, or 1 if not
	*/
	function validateStep(step){
		if(step == fieldsetCount) return;

		var hasError = false;
		var error = 1;

		if(step == 1){
			hasError = validateFirstStep();
		} else if(step == 2){
			hasError = validateSecondStep();
		} else{
			if(!requiredFieldsFilled('#formElem')) hasError = true;		
		}

		var $link = $('#navigation li:nth-child(' + parseInt(step) + ') a');
		$link.parent().find('.error,.checked').remove();
		
		var valclass = 'checked';
		if(hasError){
			error = -1;
			valclass = 'error';
		}
		$('<span class="'+valclass+'"></span>').insertAfter($link);
		
		return hasError;
	}
	
	/*
		looks if some valid latitude and longitude have been chosen aka 
		if there is a retrievable address at this point
	*/
	function validateFirstStep(){
		var hasError = true; 
		if($("#locationSearchResults").html()!=""){
			if(typeof(newPosLat) != "undefined" && typeof(newPosLat) != "undefined"){
				hasError = false; 
			}
		}
		return hasError;		
	}

	/*
		looks if shop name, shop type and at least one productCategories and opening Day were chosen
		//TODO: say it s not ok if its not ok
	*/
	var validateSecondStep = function(){
		var hasError = true;
		var hasName = requiredFieldsFilled("#mainInformationFieldset");
		var listsChecked = true;
		if($("#mainInformationFieldset #loadedAddressLabel").find("a").length > 0)
			$("#mainInformationFieldset label[for=address]").addClass("invalidLabel");
		else $("#mainInformationFieldset label[for=address]").removeClass("invalidLabel");

		$(["shopType", "productCategory", "openingDay"]).each(function(index, value) {
			if($("#mainInformationFieldset input[name="+value+"]:checked").length <= 0){
				$("#mainInformationFieldset label[for="+value+"]").addClass("invalidLabel");
				listsChecked = false;
			} else $("#mainInformationFieldset label[for="+value+"]").removeClass("invalidLabel");
		});
		if(hasName && listsChecked) hasError = false;
		return hasError;
	}


	/*
	if there are errors don't allow the user to submit
	*/
	$('#registerButton').bind('click',function(){
		if($('#formElem').data('errors')){
			alert('Please correct the errors in the Form');
			return false;
		}	
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