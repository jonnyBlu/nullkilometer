

var loadMarketStallStep = function(){


	var container = "#newMarketStallContainer";
	$("#marketStallsStepLink").removeClass("invisible");
	$("#addAMarketStallButton").click(function(){
		if(!hasFormErrors(container)){
			addMarketStall(container);
			emptyForm(container);
		}		
	});

	var addMarketStall = function(container){
		var stallInfo = readMarketStallInformation(container);
		marketStallObjectsArray.push(stallInfo);

		var firstRow = "<li><strong>"+stallInfo.name+"</strong><a href='#' class='showMarketStallInfo' id='"+stallInfo.name+"'><i class='icon-chevron-down'></i></a><a href='#' id='remove'>remove</a></li>";
		
		$("#test ul").append(firstRow); 

		$("a.showMarketStallInfo").click(function(e){
			e.preventDefault();
			var thisId = $(this).attr("id");

			//TODO: add all the information
			$("#marketStallsMoreInfoDiv").html(stallInfo.description);
			$("#marketStallsMoreInfoDiv").slideToggle();
		});

	}

	//TODO: not to forget to remove market stall from the market stalls arrayyyyyy!
	var removeMarketStall = function(){

	}

	var emptyForm = function(container){
		$(container).find('input[type=text], textarea').val('');
 		$(container).find('input:checkbox').removeAttr('checked');
	}

	var readMarketStallInformation = function(container){
	    var newStallInformation = {};
	    var productCategories = [];
	    var stallInformationInputs = $(container +" :input");

		var descriptionVal = $(container).find("textarea").val()
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
	    newStallInformation["productCategories"] = productCategories;
	    // console.log(newStallInformation);
	    return newStallInformation;
	}


	var hasFormErrors = function(container){	
		var hasError = true;
		var hasName = requiredFieldsFilled(container);
		var listsChecked = true;

		if($(container+" input[name=productCategory]:checked").length <= 0){
			$(container+" label[for=productCategory]").addClass("invalidLabel");
			listsChecked = false;
		} else $(container+" label[for=productCategory]").removeClass("invalidLabel");
		if(hasName && listsChecked) hasError = false;

		return hasError;
	}
}

var hideMarketStallStep = function(){
	$("#marketStallsStepLink").addClass("invisible");
}