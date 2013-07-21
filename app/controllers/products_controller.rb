class ProductsController < ApplicationController
	respond_to :html, :json
	before_filter :set_seller

	def index
		unless @seller
			@products = Product.all
		else
			@products = Product.for_seller(@seller[:type], @seller[:id])
			raise Errors::InvalidParameters, "Couldn't find #{@seller[:seller]} with id=#{@seller[:id]}" if @products.empty?
		end
		respond_with @products
	end

	def show
    @product = Product.find_by_seller_type_and_seller_id_and_category(@seller[:type], @seller[:id], params[:category])
    raise Errors::InvalidProduct, "Couldn't find PorductCategory with id=#{params[:category]} for #{@seller[:seller]} with id=#{@seller[:id]}" unless @product
    respond_with @product
  end

  private
	def set_seller
		if id = params[:pointOfSale] || params[:point_of_sale_id]
			@seller = {:type => "PointOfInterest", :id => id, :seller => "PointOfSale"}
		elsif id = params[:marketStall] || params[:market_stall_id]
			@seller = {:type => "MarketStall", :id => id, :seller => "MarketStall"}
		end
	end
end
