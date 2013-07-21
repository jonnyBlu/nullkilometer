class SuppliesController < ApplicationController
	respond_to :html, :json

	def create
		@supply = Supply.new(params[:supply])
    @supply.save
    respond_with @supply
	end
end
