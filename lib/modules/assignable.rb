module Assignable
	def self.included base
		base.attr_accessible :product_assignments_attributes
		base.has_many :product_assignments, :as => :assignable, :dependent => :destroy
  	base.accepts_nested_attributes_for :product_assignments, :allow_destroy => true, :reject_if => lambda { |pa| pa[:product_category].blank?}
	end

	def product_category_array
    @product_category_array ||= product_assignments.map(&:product_category) 
  end
end