class MarketStallsController < ApplicationController
	respond_to :json, :xml, :html

	def index
		if pos_id = params[:point_of_sale_id] || params[:pointOfSale]
			begin
				@pos = PointOfSale.find(pos_id)
			rescue ActiveRecord::RecordNotFound
				raise Errors::InvalidPointOfSale, "Couldn't find PointOfSale with id=#{pos_id}"
			end
			raise Errors::InvalidPointOfSale, "PointOfSale with id=#{pos_id} is not a Market" if @pos.pos_type != 0
			@market_stalls = @pos.market_stalls
		else
			@market_stalls = MarketStall.all
		end		
		respond_with @market_stalls
	end

	def show
		begin
			@market_stall = MarketStall.find(params[:id])
		rescue ActiveRecord::RecordNotFound
			raise Errors::InvalidMarketStall, "Couldn't find MarketStall with id=#{params[:id]}"
		end
		respond_with @market_stall
	end

	def new
		if pos_id = params[:point_of_sale_id] || params[:pointOfSale]
			@parent_market = PointOfSale.find(pos_id)
		end	
		@market_stall = MarketStall.new
		@product_categories_collection = Product::CATEGORY_NAMES.each_with_index.map{|name, index| [name, index]}
		respond_with @market_stall 
	end

	def create
		pars = params[:market_stall]
        pars["productCategoryIds"].delete("")
		@market_stall = MarketStall.new(pars)
	 	@market_stall.save

	 	parent_market = PointOfSale.find(pars[:point_of_sale_id])
	 	parent_market.product_category_ids = updated_product_category_ids(parent_market)
	 	parent_market.save

	 	puts "product cat ids:"
	 	puts parent_market.product_category_ids 

	 	respond_with @market_stall 
	end

	# def update
	# 	@market_stall = MarketStall.find(params[:id])
	# 	@market_stall.update_attributes(params[:market_stall])
	# 	respond_with @market_stall
	# end

	# def destroy
	# 	@market_stall = MarketStall.find(params[:id])
	# 	@market_stall.destroy
	# 	respond_with @market_stall
	# end
end
