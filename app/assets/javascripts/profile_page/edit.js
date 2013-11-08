var posId;
var url;
var posObject;
var marketStallsOfThisPos = [];

$(function() {
    var parameters = window.location.search;
    posId = parameters.substr(1).split('=')[1];
    editPos(posId);
});

var editPos = function(){
    var dataToSend = { id : posId };
    //TODO: the right url
    url = "../test_posInfo.json";
    callAjax(url, dataToSend, fillInTheForm);
}


var fillInTheForm = function(response){
    posObject = response.pointOfSale;


    var container = $("#editProfilePageContainer");
    // console.log(posObject);

    $.each(posObject, function(key, value){
        if (key=="name" || key=="address") {
            container.find("label[for="+key+"]").html(value);
        } 
        else if(key == "shopTypeId"){
            container.find("label[for='shopType']").html(shopTypeNames[value]);
            if(value==MARKETINDEX){
                $("#marketStallsContainer").css("display", "block");
            }
        }
        else if(key=="products"){
            $.each(value, function(key, value){
                var catObject = value;
                container.find("input[name='productCategory'][value="+catObject.categoryId+"]").attr("checked", true);
            });
        }
        else if (key == "description") container.find("textarea[name="+key+"]").val(value);
        else if (key == "openingTimes"){
            $.each(value, function(key, value){
                var openingDayObject = value;
                var thisDayInput = container.find("input[name='openingDay'][value="+openingDayObject.dayId+"]");
                thisDayInput.attr("checked", true);  
                var thisDayInputRow = thisDayInput.parent().parent().parent();
                thisDayInputRow.find("input[name='openingTime_from']").val(openingDayObject.from);
                thisDayInputRow.find("input[name='openingTime_to']").val(openingDayObject.to);
            });
            openingTimeListeners();
        }
        else if (key=="marketStalls"){
            fillInMarketStallsEditForm(value);
        }
        else container.find("input[name="+key+"]").val(value);
    });


}


var  fillInMarketStallsEditForm = function(marketStallsInformation){

    var marketStallIndex = 0;   
    var helperContainer =  $("#helperEditMarketStallsContainer");     
    $("#marketStallsTitle").css("display", "block");

    $.each(marketStallsInformation, function(){  

        var thisId ="ms_"+this.id;   

        helperContainer.find("a.accordion-toggle").html(this.name);                
        helperContainer.find("a.accordion-toggle").attr("href", "#"+thisId);
        helperContainer.find("a.accordion-toggle").attr("id", this.id);
        helperContainer.find(".accordion-body").attr("id", thisId);

//TODO:
        var url = "../test_marketStallInfo.json"; //later -> this.url

        //getting data of each marketStall
        callAjax(url, {}, function(data){
            var marketStallObject = data.marketStall;
            var marketStallId = marketStallObject.id;
            marketStallsOfThisPos[marketStallId] = marketStallObject;           
            fillInTheMarketStallsForm(marketStallObject, $("#"+thisId));

            setMarketStallsEditListeners($("#"+thisId));
        });

        var htmlForMarketStall = helperContainer.find(".accordion").html();
        $("#marketStallsContainer").find(".accordion").append(htmlForMarketStall);
        marketStallIndex ++;
    });
}


var fillInTheMarketStallsForm = function(data, container){

    $.each(data, function(key, value){
        if(key=="products"){
            $.each(value, function(key, value){
                var catObject = value;
                // container.find("input[name='productCategory']").attr("checked", false);               
                container.find("input[name='productCategory'][value="+catObject.categoryId+"]").attr("checked", true);

            });
        }
        else if (key == "description") container.find("textarea[name="+key+"]").val(value);
        else container.find("input[name="+key+"]").val(value);
    });
}

var setMarketStallsEditListeners = function(container){
    var marketStallId= container.attr("id").split("_")[1];

    container.find("#confirmEditingMarketStallButton").click(function(){
        var listsFilled = isRequiredListFilled(container,"productCategory");
        if(listsFilled){
            var marketStallObject = readAndUpdateMarketStallInformation(container);
        }
    });
    container.find("#removeMarketStallButton").click(function(){
        triggerAlert(container, marketStallId);
    });
    container.find("#cancelEditingMarketStallButton").click(function(){
        var thisMarketStallInformation = marketStallsOfThisPos[marketStallId];
        fillInTheMarketStallsForm(thisMarketStallInformation, container);
    });
}


var triggerAlert = function(container, marketStallId){
    $(function() {

        $( "#dialog-confirm" ).dialog({
          resizable: false,
          height:140,
          modal: true,
          buttons: {
            "Ja, Markstand entfernen": function() {
              $( this ).dialog( "close" );
              removeMarketStall(container, marketStallId);
            },
            "Abbrechen": function() {
              $( this ).dialog( "close" );
            }
          }
        });
      });
}

var removeMarketStall = function(container, marketStallId){

    delete marketStallsOfThisPos[marketStallId];
    container.parent().remove();

}

var readAndUpdateMarketStallInformation = function(container){

    var thisMarketId = container.attr("id").split("_")[1];
    var thisMarketStallObject = marketStallsOfThisPos[thisMarketId];
    var productCategories = [];
    var stallInformationInputs = container.find(" :input");


    var descriptionVal = container.find("textarea").val();
    thisMarketStallObject.description=descriptionVal;

    thisMarketStallObject.phone = container.find(" :input[name=phone]").val();
    thisMarketStallObject.website = container.find(" :input[name=website]").val();
    thisMarketStallObject.mail = container.find(" :input[name=mail]").val();

    container.find(" :input[name=productCategory]").each(function(){
        if(this.checked)
            productCategories.push($(this).val());
    });
    thisMarketStallObject.products=productCategories;
    console.log(marketStallsOfThisPos[thisMarketId]);
    return marketStallsOfThisPos[thisMarketId];
}

