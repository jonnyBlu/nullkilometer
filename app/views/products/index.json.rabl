collection @products, :object_root => false

node :url do |p|
	if p.seller_type == "MarketStall"
		market_stall_product_url(p.seller_id, p)
	elsif p.seller_type == "PointOfSale"
		point_of_sale_product_url(p.seller_id, p)
	end
end

attributes :category => :categoryId