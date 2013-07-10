class ProductsController < ApplicationController
	before_filter :set_seller

	respond_to :html, :json

	def index
		if !@seller
			@products = Product.all
		else
			@products = Product.for_seller(@seller[:type], @seller[:id])
		end
		respond_with @products
	end

	def show
    @product = Product.find_by_seller_type_and_seller_id_and_category(@seller[:type], @seller[:id], params[:category])
    respond_with @product
  end

	def set_seller
		if id = params[:pointOfSale] || params[:point_of_sale_id]
			@seller = {:type => "PointOfSale", :id => id}
		elsif id = params[:marketStall] || params[:market_stall_id]
			@seller = {:type => "MarketStall", :id => id}
		end
	end
end
