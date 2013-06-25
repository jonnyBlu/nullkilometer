
var generateOverview = function(){

	readMainInformation();
}

var readMainInformation = function(){		

    var newPosInformation = {};
    var openingDays = [];
    var productCategories = [];
    var mainInformationInputs = $("#mainInformationFieldset :input");

    newPosInformation["lat"] = newPosLat;
    newPosInformation["lon"] = newPosLon;
    newPosInformation["address"] = newPosAddress;

    mainInformationInputs.each(function(){
        var n = this;
        if (n.type=="text"){
            if(n.name=="name"){
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
                } else if(n.name == "shopType")
                    newPosInformation[n.name] = $(n).val(); 
            }
        }
    });
    newPosInformation["productCategories"] = productCategories;
    newPosInformation["openingDays"] = openingDays;
     // console.log(newPosInformation);
}