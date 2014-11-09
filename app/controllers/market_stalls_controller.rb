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
		if pos_id = params[:point_of_sale_id] || params[:pointOfSale]
			@parent_market = PointOfSale.find(pos_id)
		end	
		@market_stall = MarketStall.new
		@product_categories_collection = I18n.t("product.category_names").each_with_index.map{|name, index| [name, index]}
		respond_with @market_stall 
	end

	def create
		pars = params[:market_stall]
        pars["productCategoryIds"].delete("")
        stall_products = pars["productCategoryIds"]
		@market_stall = MarketStall.new(pars)

	 	if @market_stall.save	
	 		redirect_to action: 'show', id: @market_stall.id, format: 'html'  
	    else
	        respond_with @market_stall 
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
end
