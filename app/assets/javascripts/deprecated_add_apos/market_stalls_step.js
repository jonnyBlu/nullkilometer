

var loadMarketStallStep = function(){

	var container = $("#newMarketStallContainer");
	$("#marketStallsStepLink").removeClass("invisible");
	$("#addAMarketStallButton").click(function(){
		if(!hasFormErrors(container)){
			addMarketStall(container);	
			emptyForm(container);
		}
	});


	var addMarketStall = function(container){

		var stallObject = readMarketStallInformation(container);

		marketStallObjectsArray.push(stallObject);
		var marketStallRow = "<li><ul>"+
								"<li id='"+stallObject.name+"' class='marketStallTitleRow'><span>"+stallObject.name+"    </span><a href='#' class='showMarketStallInfo' id='"+stallObject.name+"'><i class='icon-chevron-down'></i></a><a href='#' id='removeMarketStall'>entfernen</a></li>"+
								"<li class='moreMarketStallInformation'><div></div></li>"+
							"</ul></li>";

		$("#test > ul").append(marketStallRow); 
		setMarketStallListListeners(stallObject);
		//trigger the information box opening
		$("#"+stallObject.name).click();
	}



	var setMarketStallListListeners = function(marketStallObject){

		//SHOW MARKET STALL INFO
		$("#"+marketStallObject.name).click(function(e){
			e.preventDefault();

			var moreInformationHtml = $("#marketStallinformationContainer").html();
			var moreInformationElement = $(this).parent().find("li.moreMarketStallInformation");
			
			moreInformationElement.html(moreInformationHtml);
			$.each(marketStallObject, function(key, value){
				var readableValue = value;
				if(key=="products") readableValue = representProductCategoriesInReadableForm(value);
				moreInformationElement.find("label[for="+key+"]").html(readableValue);
			});

			moreInformationElement.slideToggle();

			var iconClass = $(this).find("i").attr("class");
			if(iconClass=="icon-chevron-down"){
				$(this).find("i").removeClass("icon-chevron-down");
				$(this).find("i").addClass("icon-chevron-up");
			} else {
				$(this).find("i").removeClass("icon-chevron-up");
				$(this).find("i").addClass("icon-chevron-down");
			}

			setEditMarketStallListener(marketStallObject);
		});

		//REMOVE A MARKET STALL
		removeMarketStall(marketStallObject);
	}


	var setEditMarketStallListener = function(marketStallObject){
		var link = $("li#"+marketStallObject.name).parent().find(".moreMarketStallInformation > div > #editMarketStall")
		link.click(function(e){
			// $("#newMarketStallContainer").hide();
			var moreInfoRow = $("a.showMarketStallInfo#"+marketStallObject.name).parent().parent().find("li.moreMarketStallInformation");
			
			moreInfoRow.html($("#invisibleMarketStallContainer").html());

			$.each(marketStallObject, function(key, value){
				if(key=="products"){
					$.each(value, function(){
						moreInfoRow.find("input[name='productCategory'][value="+this+"]").attr("checked", true);
					});
				}
				else if (key == "description") moreInfoRow.find("textarea[name="+key+"]").val(value);
				else moreInfoRow.find("input[name="+key+"]").val(value);
			});

			setEditMarketButtonListener(marketStallObject);
			$("#cancelEditingMarketStallButton").click(function(){
				$("#"+marketStallObject.name).click();
			});
		});
	}

	var setEditMarketButtonListener = function(marketStallObject){
		$("#confirmEditingMarketStallButton").click(function(){
			var container = $(this).parent().parent();
			//TODO: chek validity

			// if(!hasFormErrors(container)){				
				$("li#"+marketStallObject.name+" #removeMarketStall").click();
				addMarketStall(container);	
				emptyForm(container);
			// }
		});
	}

	var removeMarketStall = function(marketStallObject){
		$("li#"+marketStallObject.name+" #removeMarketStall").click(function(e){
			//TODO: popup for confirmation
			e.preventDefault();
			marketStallObjectsArray = returnMarketStallObjectArrayWithout(marketStallObject.name);
			$(this).parent().parent().remove();
		});
	}

	var returnMarketStallObjectArrayWithout = function(nameToDelete){
		var newMarketStallsArray = [];
		$.each(marketStallObjectsArray, function(){
			if(this.name != nameToDelete){
				newMarketStallsArray.push(this);
			}
		});
		return newMarketStallsArray;
	}



	var emptyForm = function(container){
		container.find('input[type=text], textarea').val('');
 		container.find('input:checkbox').removeAttr('checked');
	}


	var hasFormErrors = function(container){	
		var hasError = true;
		var containerName = container.selector;
		var hasName = requiredFieldsFilled(containerName);
		var listsChecked = true;

		if(container.find(" input[name=productCategory]:checked").length <= 0){
			container.find(" label[for=productCategory]").addClass("invalidLabel");
			listsChecked = false;
		} else container.find(" label[for=productCategory]").removeClass("invalidLabel");
		if(hasName && listsChecked) hasError = false;

		return hasError;
	}
}

var hideMarketStallStep = function(){
	$("#marketStallsStepLink").addClass("invisible");
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