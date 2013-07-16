class PointOfProductionsController < ApplicationController
	respond_to :html, :json

	def index
		if params[:lat] && params[:lon] && params[:radius]
      @point_of_productions = PointOfProduction.nearby(params[:lat], params[:lon], params[:radius])
    else
			@point_of_productions = PointOfProduction.all
		end
		respond_with @point_of_productions
	end

	def show
		@point_of_production = PointOfProduction.find(params[:id])
		respond_with @point_of_production
	end
end
