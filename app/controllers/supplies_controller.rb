class SuppliesController < ProductCategoriesController
	respond_to :html, :json

	def create
		@supply = Supply.new(params[:supply])

    if @supply.save
      respond_with @supply
    else
      #error massage here!!!
      respond_with @supply.errors
    end
	end
end
