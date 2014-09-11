$(function() {
    $("#marketStallsContainer_NOJS").css("display", "none");
    $("#marketStallsContainer").css("display", "block");

    var parameters = window.location.pathname,
    posId = parameters.split('/')[parameters.split('/').length-1].split('.')[0],
    profilePage = new ProfilePage(),
    map = new ProfileMap();

    profilePage.load(posId, function(response){
        var posInformation = response.pointOfSale;
        $("#profilePagePosMap").html("");
        map.initMap(posInformation.lat, posInformation.lon, ZOOMONMARKERLEVEL-3, 'profilePagePosMap');
        map.loadMarker(posInformation);
       // map.locateUser(6);
    });
});

function ProfilePage(){
    load = function(id, onSuccessReadPosInformation){
        callAjax("/point_of_sales/"+id, null, onSuccessReadPosInformation);  
    };
    return{
        load : load,
    }
}
