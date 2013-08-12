collection @point_of_interests #, :root => :pointOfSales, :object_root => false

node do :self |pos|
	point_of_sale_path(pos)
end
# node do :links |pos|
# 	{:self => point_of_sale_path(pos))
# end

attributes :id, :name, :lat, :lon, :posTypeId

node :productCategoryIds do |pos|
	updated_product_category_ids(pos)
end

child :opening_times => :openingTimes do
	attributes :day => :dayId
	attributes :from, :to
end


