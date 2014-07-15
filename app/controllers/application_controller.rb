class ApplicationController < ActionController::Base
  protect_from_forgery

	rescue_from Errors::NotFoundError do |e|
		render :json => {:errors => e.message}, :status => 404
	end

	private
	def object_representation_for_constant(constant, object_name)
    objects = []
    constant.each_index{ |i| objects[i] = {i => constant[i]}}
    {object_name => objects}
  end

#had to move the 2 following methods here from point_of_sales_helper, because they were not 
#accessible from there (ipossble to use helper methods in controllers)
	def updated_product_category_ids pos
	categories = pos.product_category_ids
		if(pos.pos_type == 0)
			pos.market_stalls.each do |stall|
				categories.concat(stall.product_category_ids)
			end
			categories.uniq!
		end
		categories
	end

  	def product_category_names pos
		Product::CATEGORY_NAMES.values_at(*pos.product_category_ids)
	end
	
end