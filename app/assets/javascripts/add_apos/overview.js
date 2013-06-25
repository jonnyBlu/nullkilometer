var generateOverview = function(){
	var newPosInformation = readInformation("#mainInformationFieldset, #additionalInformationFieldset");
    displayInformation(newPosInformation); 

}

var displayInformation = function(information){
    $.each(information, function(key, value){
        var readableValue = value;
        if(key=="shopType"){
            readableValue = shopTypeNames[value];
            if(value == MARKETINDEX){//market
                $(".row.invisible").removeClass("invisible");
            }
        } 
        else if(key=="productCategories"){
            readableValue = "";
            for(v in value) readableValue += productCategoryNames[v]+", ";             
        } else if(key == "openingDays"){
            readableValue = "<ul>";
            $.each(value, function(){
                var dayName = weekDayNames[this.dayId];
                var times;
                if(this.from == "" || this.to == "") times = ": ?";
                else times = ": "+this.from+"  -  "+this.to;
                readableValue += "<li>"+dayName+times+"</li>";    
            });
            readableValue += "</ul>";
        }

        $("#overviewContainer label[for="+key+"]").html(readableValue);
    });
    // $("#overviewContainer").
}


var readInformation = function(containers){		

    var newPosInformation = {};
    var openingDays = [];
    var productCategories = [];
    var mainInformationInputs = $(containers).find(":input");
    var descriptionTextarea = $(containers).find("textarea");
    var isMarket = false;
    var marketStallInformation = [];

    newPosInformation["lat"] = newPosLat;
    newPosInformation["lon"] = newPosLon;
    newPosInformation["address"] = newPosAddress;

    mainInformationInputs.each(function(){
        var n = this;
        if (n.type=="text"){
            if(n.name!="openingTime_from" && n.name!="openingTime_to"){
                if($(n).val()!= "")
                    newPosInformation[n.name] = $(n).val();
            }                    
        } else if (n.type == "radio" || n.type == "checkbox"){
            if(n.checked){
                if(n.name == "productCategory")
                    productCategories.push($(n).val());
                else if(n.name == "openingDay"){
                    var from = $(n).parent().parent().parent().find("input[name=openingTime_from]").val();
                    var to =  $(n).parent().parent().parent().find("input[name=openingTime_to]").val();
                    var dayTimeObj = {
                        dayId : $(n).val(),
                        from : from,
                        to : to
                    }
                    openingDays.push(dayTimeObj);                   
                } else if(n.name == "shopType"){
                    newPosInformation[n.name] = $(n).val(); 
                    if($(n).val() == MARKETINDEX){
                        isMarket = true;
                    }
                }
            }
        }
    });
    if($(descriptionTextarea).val()!= ""){
        newPosInformation["description"] = $(descriptionTextarea).val();
    }

    newPosInformation["productCategories"] = productCategories;
    newPosInformation["openingDays"] = openingDays;

    if(isMarket){
        // $.each(marketStallObjectsArray, function(){
        // });
        newPosInformation["marketStalls"] = marketStallObjectsArray;
    }


    console.log(JSON.stringify(newPosInformation, null, 4));
    return newPosInformation;
}