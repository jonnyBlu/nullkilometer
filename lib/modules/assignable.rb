module Assignable
	def self.included base
		base.attr_accessible :sales_assignments_attributes
		base.has_many :sales_assignments, :as => :assignable, :dependent => :destroy
  	base.accepts_nested_attributes_for :sales_assignments, :allow_destroy => true, :reject_if => lambda { |pa| pa[:product_category].blank?}
	end

	def product_category_array
    @product_category_array ||= sales_assignments.map(&:product_category) 
  end
end