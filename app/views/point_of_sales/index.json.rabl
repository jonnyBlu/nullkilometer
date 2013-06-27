collection @point_of_sales, :root => 'POS', :object_root => false

attributes :lat, :lon, :shop_type_id, :opening_times_string
attributes :product_category_id_array => :product_category_ids, :opening_times_day_array => :opening_day_ids

node :url do |pos|
	point_of_sale_url(pos)
end
