object @point_of_sale => 'pointOfSale'
attributes :name, :address, :lat, :lon, :shopTypeId, :description, :website, :mail, :phone

child :opening_times => :openingTimes do
	attributes :day => :dayId
	attributes :from, :to
end

child :market_stalls, :if => lambda { |pos| pos.shop_type == 1} do
	extends "market_stalls/index"
end

child :products do
	extends "products/index"
end