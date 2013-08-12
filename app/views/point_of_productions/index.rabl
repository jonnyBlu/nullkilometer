collection @point_of_interests #, :root => :pointOfProductions, :object_root => false

attributes :id, :name, :lat, :lon

if product_id = locals[:product_id]
	node :distance do |pop|
		pop.delivery(product_id).distance
	end
end

node :self do |pop|
	point_of_production_path(pop)
end
# node :links do |pop|
# 	{:self => point_of_production_path(pop)}
# end
