collection @point_of_sales, :root => 'POS', :object_root => false

attributes :lat, :lon, :open_on, :type_of_POS

node :url do |pos|
	point_of_sale_url(pos)
end