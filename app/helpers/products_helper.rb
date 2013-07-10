module ProductsHelper
	def seller_product_category_url product
		if product.seller_type == "MarketStall"
			market_stall_url(product.seller_id) + "/product_category/" + product.category.to_s
		elsif product.seller_type == "PointOfSale"
			point_of_sale_url(product.seller_id) + "/product_category/" + product.category.to_s
		end
	end
end