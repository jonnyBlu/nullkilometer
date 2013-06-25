

var loadMarketStallStep = function(){

	$("#marketStallsStepLink").removeClass("invisible");
	$("#addAMarketStallButton").click(function(){
		if(!hasFormErrors("#newMarketStallContainer")){
			addMarketStall("#newMarketStallContainer");
		}		
	});

	var addMarketStall = function(container){
		var stallInfo = readMarketStallInformation(container);
		//TODO: load list and empty the form
		$("#marketStallList").append("<li>"+stallInfo+"</li>")
	}

	var readMarketStallInformation = function(container){
	    var newStallInformation = {};
	    var productCategories = [];
	    var stallInformationInputs = $(container +" :input");

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
	    newStallInformation["productCategories"] = productCategories;
	    console.log(newStallInformation);
	    return newStallInformation;
	}


	var hasFormErrors = function(container){	
		var hasError = true;
		var hasName = requiredFieldsFilled(container);
		var listsChecked = true;

		if($(container+" input[name=productCategory]:checked").length <= 0){
			$(container+" label[for=productCategory]").addClass("invalidLabel");
			listsChecked = false;
			console.log("bl");
		} else $(container+" label[for=productCategory]").removeClass("invalidLabel");
		if(hasName && listsChecked) hasError = false;

		return hasError;
	}
}

var hideMarketStallStep = function(){
	$("#marketStallsStepLink").addClass("invisible");
}