collection @point_of_productions, :root => :pointOfProduction, :object_root => false

attributes :id, :name, :lat, :lon

if product_id = locals[:product_id]
	node :distance do |pop|
		pop.supply(product_id).distance
	end
end

node :url do |pop|
	point_of_production_url(pop)
end
