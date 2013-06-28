collection @point_of_sales, :root => 'POS', :object_root => false

attributes :lat, :lon, :shopTypeId
attributes :product_category_array => :productCategoryIds, :opening_times_day_array => :openingTimesDayIds

node :url do |pos|
	point_of_sale_url(pos)
end
