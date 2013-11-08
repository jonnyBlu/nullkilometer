//TODO: days should be returned in a way that 0 (sunday) is not at the beginning
//TODO: pass posId to server call
var posId;
$(function() {
    var parameters = window.location.search;
    posId = parameters.substr(1).split('=')[1];
	loadProfilePage();	
});

var loadProfilePage = function(){
    callAjax("test_posInfo.json", onSuccessReadPosInformation);
}

var callAjax = function(url, onSuccess){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        success: onSuccess,
        error: function(xhr, error){
            console.debug(xhr); console.debug(error);
        }
    }).done(function() {
    });
}

var onSuccessReadPosInformation = function(response){	
	var posInformation = response.pointOfSale;
	console.log(posInformation);
	displayInformationInProfilePage(posInformation, $("#profilePageContainer"));
	initProfileMap(posInformation.lat, posInformation.lon, ZOOMONMARKERLEVEL);
	loadMarker(posInformation);
}

var displayInformationInProfilePage = function(posInformation, container){
    $.each(posInformation, function(key, value){
        var readableValue = value;
        if(key=="shopTypeId"){
            readableValue = shopTypeNames[value];
            $("#profilePageHeader #posType").html(readableValue);
            if(value == MARKETINDEX){//market
                $("#marketStallsContainer").css("display", "block");
            }
        } else if(key=="name"){
        	$("#profilePageHeader #posName").html(value);
        } else if(key=="website"){
        	 readableValue = "<a href="+value+"  target='_blank'>"+value+"</a>";
        }
        else if(key=="products"){
            fillInProductCategoriesInfo(value, container);
        } else if(key == "openingTimes"){
            readableValue = "<ul>";
            $.each(value, function(){
                var dayName = weekDayNames[this.dayId];
                var times;
                if(this.from == "" || this.to == "") times = ": ?";
                else times = ": "+this.from+"  -  "+this.to;
                readableValue += "<li>"+dayName+times+"</li>";    
            });
            readableValue += "</ul>";
        } else if(key == "marketStalls") {  
            fillInMarketStallContainer(value);  
        }

        container.find("label[for="+key+"]").html(readableValue);
    });
}

var fillInProductCategoriesInfo = function(productCategoriesInformation, container){
    readableValue = "" ;
    $.each(productCategoriesInformation, function(key, value){
        readableValue += productCategoryNames[value.categoryId]+", ";  
    });  
    readableValue = readableValue.substring(0, readableValue.length-2);   
    container.find("label[for='productCategories']").html(readableValue);  
}

var fillInMarketStallContainer= function(marketStallsInformation){
   var marketStallIndex = 0;   
    var helperContainer =  $("#helperMarketStallsContainer");     
    $("#marketStallsTitle").css("display", "block");
    $.each(marketStallsInformation, function(){                
        var thisId = "marketStall"+marketStallIndex;

        helperContainer.find("a").html(this.name);                
        helperContainer.find("a").attr("href", "#"+thisId);
        helperContainer.find(".accordion-body").attr("id", thisId);
        var url = "test_marketStallInfo.json"; //later -> this.url
        helperContainer.find(".accordion-inner").html(getHtmlForMarketStallInformation(url, thisId));

        var htmlForMarketStall = helperContainer.find(".accordion").html();
        $("#marketStallsContainer").find(".accordion").append(htmlForMarketStall);
        marketStallIndex ++;
    });
}

var getHtmlForMarketStallInformation = function(url, containerId){

    callAjax(url, function(data){
        var marketStallInformation = data.marketStall;
        console.log(marketStallInformation);
        displayMarketStallsInformationInProfilePage(marketStallInformation, $("#"+containerId));
    });
}

var displayMarketStallsInformationInProfilePage = function(posInformation, container){
    $.each(posInformation, function(key, value){
        var readableValue = value;
        if(key=="website"){
             readableValue = "<a href="+value+"  target='_blank'>"+value+"</a>";
        }
        else if(key=="products"){
            fillInProductCategoriesInfo(value, container);    
        } 

        container.find("label[for="+key+"]").html(readableValue);
    });
}


