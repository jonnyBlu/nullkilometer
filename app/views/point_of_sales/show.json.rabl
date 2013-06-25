object @point_of_sale
attributes :name, :address, :lat, :lon, :open_on, :type_of_POS

child :opening_times do
	attributes :id, :day, :open_at, :close_at
end