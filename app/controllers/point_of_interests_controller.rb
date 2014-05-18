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
      for i in 0..6
        @point_of_interest.opening_times.build(dayId: i)
      end
    end
    respond_with @point_of_interest
  end

	def create
    if params[:type] == "PointOfSale"
      pars = params[:point_of_sale]
      pars["productCategoryIds"].delete("")
      @point_of_interest = @poi_class.new(pars)
    end
    @point_of_interest.save
    respond_with @point_of_interest
  end

  def edit
    begin
      @point_of_interest = @poi_class.find(params[:id])
      @pos_types_collection = PointOfSale::POS_TYPE_NAMES.each_with_index.map{|name, index| [name, index]}
      @product_categories_collection = Product::CATEGORY_NAMES.each_with_index.map{|name, index| [name, index]}
      for i in 0..6
        if !@point_of_interest.opening_times.where(day: i).exists?
          @point_of_interest.opening_times.build(dayId: i)
        end
      end
      @point_of_interest.opening_times.sort_by!{ |ot| ot.dayId }
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfInterest, "Couldn't find #{@poi_class} with id=#{params[:id]}"
    end
    respond_with @point_of_interest
  end

  def update
    begin
      @point_of_interest = @poi_class.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfInterest, "Couldn't find #{@poi_class} with id=#{params[:id]}"
    end
    if params[:type] == "PointOfSale"
      pars = params[:point_of_sale]
      pars["productCategoryIds"].delete("")
      if @point_of_interest.update_attributes(params[:point_of_sale])
        flash[:success] = "Profil aktualisiert"
        redirect_to @point_of_interest
      else
        flash[:success] = "Profil nicht aktualisiert"
        redirect_to @point_of_interest
      end
    end
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
