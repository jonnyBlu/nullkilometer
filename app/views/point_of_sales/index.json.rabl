collection @point_of_sales, :root => 'POS', :object_root => false

attributes :lat, :lon, :open_on, :shop_type_id

child :product_categories, :object_root => false do |pos|
	attributes :id
end

node :url do |pos|
	point_of_sale_url(pos)
end
