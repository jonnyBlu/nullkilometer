class ProductCategoriesController < ApplicationController
	before_filter :set_seller

	def set_seller
		if id = params[:pointOfSale] || params[:point_of_sale_id]
			@seller = {:type => "PointOfInterest", :id => id}
		elsif id = params[:marketStall] || params[:market_stall_id]
			@seller = {:type => "MarketStall", :id => id}
		end
	end
end