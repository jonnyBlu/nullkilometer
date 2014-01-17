$(function() {
    $("#marketStallsContainer_NOJS").css("display", "none");
    $("#marketStallsContainer").css("display", "block");


    var parameters = window.location.pathname;
    var posId = parameters.split('/')[parameters.split('/').length-1].split('.')[0];

    var profilePage = new ProfilePage();
    var map = new ProfileMap();
    profilePage.load(posId, function(response){
        var posInformation = response.pointOfSale;
        $("#profilePagePosMap").html("");
        map.initMap(posInformation.lat, posInformation.lon, ZOOMONMARKERLEVEL, 'profilePagePosMap');
        map.loadMarker(posInformation);
    });
});

function ProfilePage(){
    var id;
    load = function(id, onSuccessReadPosInformation){
        this.id = id;     
        callAjax("/api/point_of_sales/"+id, null ,onSuccessReadPosInformation);  
    };
    return{
        load : load,
    }
}
