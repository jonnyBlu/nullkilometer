object @market_stall => :marketStall
attributes :name, :description, :website, :mail, :phone

child :products do
 extends "products/index"
end