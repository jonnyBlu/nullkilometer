class ProductsController < ProductCategoriesController
	respond_to :html, :json

	def index
		if !@seller
			@products = Product.all
		else
			@products = Product.for_seller(@seller[:type], @seller[:id])
		end
		respond_with @products
	end

	def show
    @product = Product.find_by_seller_type_and_seller_id_and_category(@seller[:type], @seller[:id], params[:category])
    respond_with @product
  end
end
