class PointOfProductionsController < ApplicationController
	respond_to :html, :json

	def index
		if params[:lat] && params[:lon] && params[:radius]
			begin
	      @point_of_productions = PointOfProduction.nearby(params[:lat], params[:lon], params[:radius]).all
	    rescue ActiveRecord::StatementInvalid
	    	raise Errors::InvalidParameters, "Coordinate values are out of range [-180 -90, 180 90]"
	    end
    else
			@point_of_productions = PointOfProduction.all
		end
		respond_with @point_of_productions
	end

	def show
		begin
			@point_of_production = PointOfProduction.find(params[:id])
		rescue ActiveRecord::RecordNotFound
			raise Errors::InvalidPointOfProduction, "Couldn't find PointOfProduction with id=#{params[:id]}"
		end
		respond_with @point_of_production
	end

	def create
    @point_of_production = PointOfProduction.new(params[:point_of_production])
    @point_of_production.save
    respond_with @point_of_production
  end

  def update
    begin
      @point_of_production = PointOfProduction.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfProduction, "Couldn't find PointOfProduction with id=#{params[:id]}"
    end
    @point_of_production.update_attributes(params[:point_of_production])
    respond_with @point_of_production
  end

  def destroy
    begin
      @point_of_production = PointOfProduction.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfProduction, "Couldn't find PointOfProduction with id=#{params[:id]}"
    end
    @point_of_production.destroy
    respond_with @point_of_production
  end
end
