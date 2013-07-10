collection @point_of_productions, :root => :pointOfProduction, :object_root => false

attributes :id, :name

node :url do |p|
	point_of_production_url(p)
end
