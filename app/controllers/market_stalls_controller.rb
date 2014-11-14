class MarketStallsController < ApplicationController
	respond_to :json, :xml, :html

	def index
		if pos_id = params[:point_of_sale_id] || params[:pointOfSale]
			begin
				@pos = PointOfSale.find(pos_id)
			rescue ActiveRecord::RecordNotFound
				raise Errors::InvalidPointOfSale, "Couldn't find PointOfSale with id=#{pos_id}"
			end
			raise Errors::InvalidPointOfSale, "PointOfSale with id=#{pos_id} is not a Market" if @pos.pos_type != 0
			@market_stalls = @pos.market_stalls
		else
			@market_stalls = MarketStall.all
      @market_stalls = @market_stalls.order(params[:sort])
		end		
		respond_with @market_stalls
	end

	def show
		begin
			@market_stall = MarketStall.find(params[:id])
		rescue ActiveRecord::RecordNotFound
			raise Errors::InvalidMarketStall, "Couldn't find MarketStall with id=#{params[:id]}"
		end
		respond_with @market_stall
	end

	def new
		puts params
		if pos_id = params[:point_of_sale_id] || params[:pointOfSale]
			@parent_market = PointOfSale.find(pos_id)
		end	
		@market_stall = MarketStall.new
    generate_form_extras
		respond_with @market_stall 
	end

	def create
		pars = params[:market_stall]
    pars["productCategoryIds"].delete("")
    stall_products = pars["productCategoryIds"]
		@market_stall = MarketStall.new(pars)

    #assign pending status only if admin not signed in
    if admin_signed_in? == false
      set_pending_status(@point_of_interest)   
    end    

    #TODO:remove the if part, cuz there should always be pos_id
	 	if pos_id = params[:market_stall][:point_of_sale_id] 
	    @parent_market = PointOfSale.find(pos_id)
	  end

	 	if @market_stall.save	
	    redirect_to @parent_market
	  else
	    generate_form_extras # should include @parent_market as well
			render :new
	  end

	end

	def edit
		begin
			@market_stall = MarketStall.find(params[:id])
		rescue ActiveRecord::RecordNotFound
	      raise Errors::InvalidPointOfInterest, "Couldn't find market stall with id=#{params[:id]}"
	  end	  
	  @product_categories_collection = I18n.t("product.category_names").each_with_index.map{|name, index| [name, index]}
		@parent_market = @market_stall.point_of_sale
		@status_name = Status.find(@market_stall.status_id).name
    @status_names_collection = Status.all.map { |s| [s.name,  s.id ]}

	  respond_with @market_stall
	end

	def update
    begin
      @market_stall = MarketStall.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfInterest, "Couldn't find market stall with id=#{params[:id]}"
    end
  	pars = params[:market_stall]
  	pars["productCategoryIds"].delete("")
		prodCats = pars["productCategoryIds"]
    	@market_stall.products.each do |product|
     	#if product.category not in prodCats
        unless prodCats.include?(product.category.to_s)
          #TODO: change product's attributes in a more "direct" ways
          @market_stall.products_attributes = { id: product.id, _destroy: true }
        end
    end

 		set_pending_status(@market_stall)

    if @market_stall.update_attributes!(params[:market_stall])
        flash[:success] = "Market stall updated successfully"
        #parent_market = @market_stall.point_of_sale
		redirect_to action: 'show', id: @market_stall.id, format: 'html' 
    else
        #flash[:error] = "Market stall not updated"
        redirect_to @market_stall 
    end
	end


	def destroy
		begin
			@market_stall = MarketStall.find(params[:id])
		rescue ActiveRecord::RecordNotFound
	      raise Errors::InvalidPointOfInterest, "Couldn't find market stall with id=#{params[:id]}"
	    end

	    if @market_stall.destroy
	      flash[:success] = "Market stall destroyed"
	      #TODO redirect to parent market html
	      @parent_market = @market_stall.point_of_sale
	      redirect_to @parent_market 
	    else
	    	#flash[:error] = "Market stall not deleted"
	      	respond_with @market_stall
	    end 
	end
	#tODO:global
  def set_pending_status(stall)
    pending_status_id = Status.find_by_name('pending').id
    stall.status_id = pending_status_id
  end

  def generate_form_extras
		@product_categories_collection = I18n.t("product.category_names").each_with_index.map{|name, index| [name, index]}
    @status_names_collection = Status.all.map { |s| [s.name,  s.id ]}
    @parent_market_collection = PointOfSale.where(:pos_type => '0').all
    #puts @parent_market_collection
  end 

end
