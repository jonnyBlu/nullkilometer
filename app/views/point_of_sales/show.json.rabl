object @point_of_sale
attributes :name, :address, :lat, :lon, :shopTypeId, :description, :website, :mail, :phone
attributes :product_category_array => :productCategoryIds

child :opening_times => :openingTimes do
	attributes :day => :dayId
	attributes :from, :to
end

child :market_stalls => :marketStalls do
	attributes :name, :description, :website, :mail, :phone
end