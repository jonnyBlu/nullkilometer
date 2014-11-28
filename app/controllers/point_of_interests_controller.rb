class PointOfInterestsController < ApplicationController

	respond_to :xml, :json, :html
  before_filter :set_poi_type 
  
	def index
    approved_status_id = Status.find_by_name('approved').id
		if params[:lat] && params[:lon] && params[:radius]
			begin
	      @point_of_interests = @poi_class.nearby(params[:lat], params[:lon], params[:radius]).all
	    rescue ActiveRecord::StatementInvalid
	    	raise Errors::InvalidParameters, "Coordinate values are out of range [-180 -90, 180 90]"
	    end
    else
      @point_of_interests = @poi_class.where(:status_id => approved_status_id).all # only approved - for the map
			@point_of_interests_all = @poi_class.all #for a global overview
      @point_of_interests_all = @point_of_interests_all.order(params[:sort])
		end
    respond_with @point_of_interests
	end

	def show
		begin
			@point_of_interest = @poi_class.find(params[:id])
      @merged_product_category_ids = updated_product_category_ids @point_of_interest
		rescue ActiveRecord::RecordNotFound
			raise Errors::InvalidPointOfInterest, "Couldn't find #{@poi_class} with id=#{params[:id]}"
		end
		respond_with @point_of_interest
	end

  def new
    @point_of_interest= @poi_class.new()
    generate_form_extras
    respond_with @point_of_interest
  end

	def create
    if params[:type] == "PointOfSale"
      pos_params = params[:point_of_sale]
      pos_params["productCategoryIds"].delete("")

      cleanup_opening_times(pos_params)

      @point_of_interest = @poi_class.new(pos_params)

      #assign pending status only if admin not signed in
      if admin_signed_in? == false
        set_pending_status(@point_of_interest)   
      end    
      
    end
    if @point_of_interest.save
      if params[:type] == "PointOfSale" && @point_of_interest.posTypeId == 0
        #redirect to new market stall for that market        
        if(params[:button] == "continue")
          logger.debug "Continue - #{params[:button]}"
          redirect_to controller: 'market_stalls', action: 'new',  point_of_sale_id: @point_of_interest.id, format: 'html', notice: 'addLater'
        else
          logger.debug "Finish - #{params[:button]}"
          redirect_to action: 'show', id: @point_of_interest.id, format: 'html'
        end
      else
        redirect_to action: 'show', id: @point_of_interest.id, format: 'html'
      end 
    else
      generate_form_extras
      render :new
    end   
  end

  def edit
    begin
      @point_of_interest = @poi_class.find(params[:id])
      @pos_types_collection = I18n.t("point_of_sale.pos_type_names").each_with_index.map{|name, index| [name, index]}
      @product_categories_collection = I18n.t("product.category_names").each_with_index.map{|name, index| [name, index]}
      @status_name = Status.find(@point_of_interest.status_id).name
      @status_names_collection = Status.all.map { |s| [s.name,  s.id ]}

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
      pos_params = params[:point_of_sale]
      pos_params["productCategoryIds"].delete("")      
      prodCats = pos_params["productCategoryIds"]

      @point_of_interest.products.each do |product|      
        unless prodCats.include?(product.category.to_s) # if product.category not in prodCats
          #TODO: change product's attributes in a more "direct" way
          @point_of_interest.products_attributes = { id: product.id, _destroy: true }
        end
      end

      cleanup_opening_times(pos_params)

      set_pending_status(@point_of_interest)

      if @point_of_interest.update_attributes!(params[:point_of_sale])
        flash[:success] = "Point of sale updated successfully"
        redirect_to @point_of_interest
      else
        flash[:success] = "Point of sale not updated"
        render "index"
        #redirect_to @point_of_interest
      end
    end
  end

  def destroy
    begin
      @point_of_interest = @poi_class.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfInterest, "Couldn't find #{@poi_class} with id=#{params[:id]}"
    end
    if @point_of_interest.destroy
      flash[:success] = "Point of interest destroyed"
      redirect_to action: 'index', format: 'html'

    else
      redirect_to action: 'show', id: @point_of_interest.id, format: 'html'
    end  
  end

  def pos_types
    respond_with object_representation_for_constant(I18n.t("point_of_sale.pos_type_names"), "pos_types")
  end

  def history
    @poi =  @poi_class.find(params[:id])
    @poi_versions = @poi.versions
    @detail_info_versions = @poi.detail_info.versions
    respond_with @poi
  end
  #TODO: global
  def set_pending_status(pos)
    pending_status_id = Status.find_by_name('pending').id
    pos.status_id = pending_status_id
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

  def generate_form_extras
    if @point_of_interest.type == "PointOfSale"
      @pos_types_collection = I18n.t("point_of_sale.pos_type_names").each_with_index.map{|name, index| [name, index]}
      @product_categories_collection = I18n.t("product.category_names").each_with_index.map{|name, index| [name, index]}
      @status_names_collection = Status.all.map { |s| [s.name,  s.id ]}
      @point_of_interest.market_stalls.build
    end
  end 

#TODO: better here or in the model?
  def cleanup_opening_times(pos_params)
    logger.debug "cleaning up opening times (destroying those with empty day): #{pos_params["opening_times_attributes"]}"
    counter = 0
    pos_params["opening_times_attributes"].each do |ot_array|
      ot = ot_array[1]
      if ot[:day].empty? #|| ( ot[:from].empty? && ot[:to].empty? ) || ot[:from] == ""
        ot['_destroy'] = true
        counter = counter+1
      end
    end
    #validate if at least one opening time is here!!!
    #solved via frontend validation
    #if counter > 6
      #puts "ERROR: all values deleted"
      #errors.add(:from, "SET AT LEAST ONE OPENING DAY WITH OPENING TIMES")
    #else
      #puts "OK: at least one opening time"
    #end
  end

  
end
