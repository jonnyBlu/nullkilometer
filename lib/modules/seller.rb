module Seller
	def self.included base
		base.attr_accessible :products_attributes
		base.has_many :products, :as => :seller, :dependent => :destroy
  	base.accepts_nested_attributes_for :products, :allow_destroy => true, :reject_if => lambda { |pa| pa[:category].blank?}
  	base.class_eval do
  		default_scope includes(:products)
  	end
	end

	def product_category_ids
    @product_category_ids ||= products.map(&:category) 
  end
end