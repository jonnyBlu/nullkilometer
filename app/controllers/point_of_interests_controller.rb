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
			@point_of_interests_all = @poi_class.all #for global overview
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
      pars = params[:point_of_sale]
      pars["productCategoryIds"].delete("")

      @point_of_interest = @poi_class.new(pars)

      #assign pending status only if admin not signed in
      if admin_signed_in? == false
        set_pending_status(@point_of_interest)   
      end    
    end
    if @point_of_interest.save
      if params[:type] == "PointOfSale" && @point_of_interest.posTypeId == 0
        #redirect to new market stall for that market
        redirect_to controller: 'market_stalls', action: 'new',  point_of_sale_id: @point_of_interest.id, format: 'html', notice: 'addLater'
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
      for i in 0..6
        if !@point_of_interest.opening_times.where(day: i).exists?
          @point_of_interest.opening_times.build(day: i)
        end
      end

      @status_name = Status.find(@point_of_interest.status_id).name
      @status_names_collection = Status.all.map { |s| [s.name,  s.id ]}

      @sorted_opening_times =  @point_of_interest.opening_times.sort_by { |ot| ot[:day] }
     # require 'pp'
     # pp @sorted_opening_times
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
      # if product.category not in prodCats
        unless prodCats.include?(product.category.to_s)
          #TODO: change product's attributes in a more "direct" way
          @point_of_interest.products_attributes = { id: product.id, _destroy: true }
        end
      end

      counter = 0
      pos_params["opening_times_attributes"].each do |ot_array|
        ot = ot_array[1]
        if ot[:day].empty? #|| ( ot[:from].empty? && ot[:to].empty? ) || ot[:from] == ""
          puts ot[:from]
          ot['_destroy'] = true
          counter = counter+1
        end
      end
      #validate if at least one opening time is here!!!
      if counter > 6
        puts "ERROR: all values deleted"
        #errors.add(:from, "SET AT LEAST ONE OPENING DAY WITH OPENING TIMES")
      else
        puts "OK: at least one opening time"
      end

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

  def set_pending_status(pos)
      pending_status_id = Status.find_by_name('pending').id
      pos.status_id = pending_status_id
  end

  def destroy
    begin
      @point_of_interest = @poi_class.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfInterest, "Couldn't find #{@poi_class} with id=#{params[:id]}"
    end
    if @point_of_interest.destroy
      flash[:success] = "Point of interest destroyed"
      redirect_to root_path
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
      for i in 0..6
        @point_of_interest.opening_times.build(day: i)
      end
      @point_of_interest.market_stalls.build
    end
  end 

  
end
