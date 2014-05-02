object @market_stall => :marketStall
attributes :name, :description, :website, :mail, :phone

child :products do
 extends "products/index"
end

node :point_of_sale do |stall|
	point_of_sale_path(stall.point_of_sale)
end