$(function() {
	$.each($(".openingDayContainer input.timeTextInput"), function(){
		if($(this).val().length !== 0)
			$(this).parent().parent().parent().removeClass("grayedOut");
	});
	
	$(".openingDayContainer input").focus(function(){
		$(this).parent().parent().parent().removeClass("grayedOut");
	});
	$(".openingDayContainer input").blur(function(){
		var from_val = $(this).parent().parent().parent().find(".point_of_sale_opening_times_from input").val(),
			to_val = $(this).parent().parent().parent().find(".point_of_sale_opening_times_to input").val();
		if(from_val != "" || to_val != "")
			$(this).parent().parent().parent().removeClass("grayedOut");
		else if(from_val === "" && to_val === "")
			$(this).parent().parent().parent().addClass("grayedOut");
	});
});