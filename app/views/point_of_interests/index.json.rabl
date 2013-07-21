collection @point_of_interests, :root => @json_root+"s", :object_root => false

if @json_root == "pointOfSale"
	extends "point_of_sales/index"
elsif @json_root == "pointOfProduction"
	extends "point_of_productions/index"
else
	attributes :id, :name, :lat, :lon, :type
	node :url do |poi|
		polymorphic_url(poi)
	end
end