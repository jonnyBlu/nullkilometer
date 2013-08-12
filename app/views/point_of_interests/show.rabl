object @point_of_interest => @json_root

if @json_root == "pointOfSale"
	extends "point_of_sales/show"
elsif @json_root == "pointOfProduction"
	extends "point_of_productions/show"
end
