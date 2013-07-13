module PointOfSalesHelper
	def updated_product_category_ids pos
	categories = pos.product_category_ids
		if(pos.shop_type == 1)
			pos.market_stalls.each do |stall|
				categories.concat(stall.product_category_ids)
			end
			categories.uniq!
		end
		categories
	end
end
