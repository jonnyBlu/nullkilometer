class MarketStallsController < ApplicationController

	respond_to :json, :html

	def index
		if pos = params[:point_of_sale_id] || params[:pointOfSale]
			@market_stalls = PointOfSale.find(pos).market_stalls
		else
			@market_stalls = MarketStall.all
		end
		respond_with @market_stalls		
	end

	def show
		@market_stall = MarketStall.find(params[:id])
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
