class ProductsController < ApplicationController
	respond_to :xml, :json
	before_filter :set_seller

	def index
		unless @seller
			@products = Product.all
		else
			@products = @seller.products
		end
		respond_with @products
	end

	def show
		if @seller
	    @product = @seller.products.with_category(params[:category]).first
	  else
	  	begin
		  	@product = Product.find(params[:id])
		  rescue ActiveRecord::RecordNotFound
				raise Errors::InvalidMarketStall, "Couldn't find MarketStall with id=#{id}"
			end
	  end
    respond_with @product
  end

  def categories
    respond_with object_representation_for_constant(I18n.t("product.category_names"), "productCategories")
  end

  private
	def set_seller
		if id = params[:pointOfSale] || params[:point_of_sale_id]
			begin
				@seller = PointOfSale.find(id)
			rescue ActiveRecord::RecordNotFound
				raise Errors::InvalidPointOfSale, "Couldn't find PointOfSale with id=#{id}"
			end
		elsif id = params[:marketStall] || params[:market_stall_id]
			begin
				@seller = MarketStall.find(id)
			rescue ActiveRecord::RecordNotFound
				raise Errors::InvalidMarketStall, "Couldn't find MarketStall with id=#{id}"
			end
		end
	end
end
