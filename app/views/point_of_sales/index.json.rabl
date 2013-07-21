collection @point_of_interests # => :pointOfSales

node :url do |pos|
	point_of_sale_url(pos)
end

attributes :id, :name, :lat, :lon, :shopTypeId

node :productCategoryIds do |pos|
	updated_product_category_ids(pos)
end


child :opening_times => :openingTimes do
	attributes :day => :dayId
	attributes :from, :to
end


