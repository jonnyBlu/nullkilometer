object @point_of_sale
attributes :name, :address, :lat, :lon
attributes :shop_type => :shopTypeId, :product_category_id_array => :productCategoryIds

child :opening_times => :openingDays do
	attributes :day => :dayId
	attributes :from, :to
end