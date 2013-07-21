class MarketStallsController < ApplicationController
	respond_to :json, :html

	def index
		if pos_id = params[:point_of_sale_id] || params[:pointOfSale]
			begin
				@pos = PointOfSale.find(pos_id)
			rescue ActiveRecord::RecordNotFound
				raise Errors::InvalidPointOfSale, "Couldn't find PointOfSale with id=#{pos_id}"
			end
			raise Errors::InvalidPointOfSale, "PointOfSale with id=#{pos_id} is not a Market" if @pos.shop_type != 1
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

	# def create
	# 	@market_stall = MarketStall.new(params[:market_stall])
	# 	@market_stall.save
	# 	respond_with @market_stall 
	# end

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
