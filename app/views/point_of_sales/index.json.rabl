collection @point_of_sales, :root => 'pointOfSales', :object_root => false

node :url do |pos|
	point_of_sale_url(pos)
end

attributes :lat, :lon, :shopTypeId
attributes :product_category_ids => :productCategoryIds

child :opening_times => :openingTimes do
	attributes :day => :dayId
	attributes :from, :to
end


