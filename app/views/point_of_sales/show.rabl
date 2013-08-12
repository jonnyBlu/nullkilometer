object @point_of_interest # => :pointOfSale
attributes :name, :address, :lat, :lon, :posTypeId, :description, :website, :mail, :phone

child :opening_times => :openingTimes do
	attributes :day => :dayId
	attributes :from, :to
end

if @point_of_interest.pos_type == 0
	# node :links do |pos|
	# 	{:consistsOf => point_of_sale_path(pos)+"/market_stalls",
	# 	 :sells => point_of_sale_path(pos)+"/products"}
	# end
	child :market_stalls => :marketStalls do
		extends "market_stalls/index"
	end
# elsif
	# node :link do |pos|
	# 	{:sells => point_of_sale_path(pos)+"/products"}
	# end
end

child :products do
	extends "products/index"
end