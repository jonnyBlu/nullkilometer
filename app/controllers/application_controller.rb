class ApplicationController < ActionController::Base

#http://stackoverflow.com/questions/8390394/switch-language-with-url-rails-3
  	before_filter :set_locale
	def set_locale
   		I18n.locale = params[:locale] || I18n.default_locale
   		:export_i18n_messages
	end

	def export_i18n_messages
	    SimplesIdeias::I18n.export! #if Rails.env.development?
	end

	protect_from_forgery

	def default_url_options(options={})
	 logger.debug "default_url_options is passed options: #{options.inspect}\n"
	  { :locale => I18n.locale }
	end
 # 

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