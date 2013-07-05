class ProductsController < ApplicationController
	before_filter :set_seller

	respond_to :html, :json

	def index
		if @seller.empty?
			@products = Product.all
		else
			@products = Product.for_seller(@seller[0], @seller[1])
		end
		respond_with @products
	end

	def show
    @product = Product.find(params[:id])
    respond_with @product
  end

	def set_seller
		@seller = []
		if id = params[:pointOfSale] || params[:point_of_sale_id]
			@seller << "PointOfSale" << id
		elsif id = params[:marketStall] || params[:market_stall_id]
			@seller << "MarketStall" << id
		end
	end
end
