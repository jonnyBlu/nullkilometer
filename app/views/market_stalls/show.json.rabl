object @market_stall => :marketStall
attributes :name, :description, :website, :mail, :phone

child :products do
 extends "products/index"
end

node :market do |stall|
	point_of_sale_url(stall.point_of_sale)
end