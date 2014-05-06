class PointOfInterestsController < ApplicationController
	respond_to :xml, :json, :html
  before_filter :set_poi_type

	def index
		if params[:lat] && params[:lon] && params[:radius]
			begin
	      @point_of_interests = @poi_class.nearby(params[:lat], params[:lon], params[:radius]).all
	    rescue ActiveRecord::StatementInvalid
	    	raise Errors::InvalidParameters, "Coordinate values are out of range [-180 -90, 180 90]"
	    end
    else
			@point_of_interests = @poi_class.all
		end
    respond_with @point_of_interests
	end

	def show
		begin
			@point_of_interest = @poi_class.find(params[:id])
		rescue ActiveRecord::RecordNotFound
			raise Errors::InvalidPointOfInterest, "Couldn't find #{@poi_class} with id=#{params[:id]}"
		end
		respond_with @point_of_interest
	end

  def new
    @point_of_interest= @poi_class.new
    if @point_of_interest.type == "PointOfSale"
      @pos_types_collection = PointOfSale::POS_TYPE_NAMES.each_with_index.map{|name, index| [name, index]}
      @product_categories_collection = Product::CATEGORY_NAMES.each_with_index.map{|name, index| [name, index]}
    end
    respond_with @point_of_interest
  end

	def create
    # if params[:type] == "PointOfSale" && params[:posTypeId] == 0
    #   @poi_class = "Market".constantize
    # elsif params[:type] == "PointOfSale" && params[:posTypeId] > 0
    #   @poi_class = "Shop".constantize
    # end
    if params[:type] == "PointOfSale"
      @point_of_interest = @poi_class.new(params[:point_of_sale])
    end
    @point_of_interest.save
    respond_with @point_of_interest
  end

  def update
    begin
      @point_of_interest = @poi_class.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfInterest, "Couldn't find #{@poi_class} with id=#{params[:id]}"
    end
    @point_of_interest.update_attributes(params[:point_of_interest])
    respond_with @point_of_interest
  end

  def destroy
    begin
      @point_of_interest = @poi_class.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfInterest, "Couldn't find #{@poi_class} with id=#{params[:id]}"
    end
    @point_of_interest.destroy
    respond_with @point_of_interest
  end

  def pos_types
    respond_with object_representation_for_constant(PointOfSale::POS_TYPE_NAMES, "pos_types")
  end

  private
  def set_poi_type
    if params[:type]
      @poi_class = params[:type].constantize
      @json_root = params[:type].sub("P", "p")
    else
      @poi_class = "PointOfInterest".constantize
      @json_root = "pointOfInterest"
    end
  end
end
