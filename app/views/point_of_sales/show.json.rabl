object @point_of_sale => 'pointOfSale'
attributes :name, :address, :lat, :lon, :shopTypeId, :description, :website, :mail, :phone

child :opening_times => :openingTimes do
	attributes :day => :dayId
	attributes :from, :to
end

if @point_of_sale.shop_type == 1
	child :market_stalls => :marketStalls do
		extends "market_stalls/index"
	end
end

child :products do
	extends "products/index"
end