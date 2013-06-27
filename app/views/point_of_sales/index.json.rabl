collection @point_of_sales, :root => 'POS', :object_root => false

attributes :lat, :lon
attributes :product_category_id_array => :productCategoryIds, :opening_times_day_array => :openingDayIds, :shop_type => :shopTypeId

node :url do |pos|
	point_of_sale_url(pos)
end
