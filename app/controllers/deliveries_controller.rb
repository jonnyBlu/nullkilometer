class DeliveriesController < ApplicationController
	respond_to :xml, :json

	def create
		@delivery = Delivery.new(params[:delivery])
    @delivery.save
    respond_with @delivery
	end
end
