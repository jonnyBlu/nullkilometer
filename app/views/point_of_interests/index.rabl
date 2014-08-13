collection @point_of_interests, :root => @json_root+"s", :object_root => false

if @json_root == "pointOfSale"
	extends "point_of_sales/index"
elsif @json_root == "pointOfProduction"
	extends "point_of_productions/index"
else
	#attributes :id, :name, :lat, :lon, :type
	node :self do |poi|
		polymorphic_path(poi)
	end
	# node :links do |poi|
	# 	{:self => polymorphic_path(poi)}
	# end
end