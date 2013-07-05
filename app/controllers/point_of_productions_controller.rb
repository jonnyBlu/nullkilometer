class PointOfProductionsController < ApplicationController
	respond_to :html, :json

	def index
		@point_of_productions = PointOfProduction.all
		respond_with @point_of_productions
	end

	def show
		@point_of_production = PointOfProduction.find(params[:id])
		respond_with @point_of_production
	end
end
