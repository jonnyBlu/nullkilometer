object @point_of_sale
attributes :name, :address, :lat, :lon, :shopTypeId, :website, :mail, :phone, :description
attributes :product_category_id_array => :productCategoryIds

child :opening_times => :openingTimes do
	attributes :day => :dayId
	attributes :from, :to
end