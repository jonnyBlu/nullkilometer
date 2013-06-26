class ProductCategoriesController < ApplicationController

	def create
		@product_category = ProductCategory.new(params[:opening_time])
		@product_category.save
		respond_with @product_category
	end

end

