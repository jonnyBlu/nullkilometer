//TODO: days should be returned in a way that 0 (sunday) is not at the beginning
//TODO: pass posId to server call
$(function() {
    var parameters = window.location.search;
    var posId = parameters.substr(1).split('=')[1];
    var profilePage = new ProfilePage();
	profilePage.load(posId);	
});

function ProfilePage(id){
    var id;
    this.load = function(id){
        //TODO: hit backend passing posId
        this.id = id;
        callAjax("test_posInfo.json", onSuccessReadPosInformation);
    }

    function callAjax(url, onSuccess){
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

    function onSuccessReadPosInformation(response){   
        var posInformation = response.pointOfSale;
        //console.log(posInformation);
        displayInformationInProfilePage(posInformation, $("#profilePageContainer"));
        initProfileMap(posInformation.lat, posInformation.lon, ZOOMONMARKERLEVEL);
        loadMarker(posInformation);
    }

    function displayInformationInProfilePage(posInformation, container){
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

    function fillInProductCategoriesInfo(productCategoriesInformation, container){
        readableValue = "" ;
        $.each(productCategoriesInformation, function(key, value){
            //readableValue += productCategoryNames[value.categoryId]+", ";  
            var name = productCategoryNames[value.categoryId];
            var url = productCategoryIconImageLocation +productTypeIconImageUrls[value.categoryId];
            readableValue = readableValue +" " +"<img class = 'categoryIcon' src = '" + url + "' title='" + name+ "' />"  
        });  
    //    readableValue = readableValue.substring(0, readableValue.length-2); 

        container.find("label[for='productCategories']").html(readableValue);  
    }

    function fillInMarketStallContainer(marketStallsInformation){
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

    function getHtmlForMarketStallInformation(url, containerId){

        callAjax(url, function(data){
            var marketStallInformation = data.marketStall;
           // console.log(marketStallInformation);
            displayMarketStallsInformationInProfilePage(marketStallInformation, $("#"+containerId));
        });
    }

    function displayMarketStallsInformationInProfilePage(posInformation, container){
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

};



