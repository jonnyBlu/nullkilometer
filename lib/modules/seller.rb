module Seller
	def self.included base
		base.attr_accessible :productCategoryIds
    base.alias_attribute :productCategoryIds, :product_category_ids
		base.has_many :products, :as => :seller, :dependent => :destroy
  	base.accepts_nested_attributes_for :products, :allow_destroy => true, :reject_if => lambda { |pa| pa[:category].blank?}
    base.validate :validate_presence_of_product_categories
  	base.class_eval do
  		default_scope includes(:products)
  	end
	end

	def product_category_ids
    @product_category_ids ||= products.map(&:category)
  end

  def product_category_ids=(array)
    array.uniq.each do |id|
      if !product_category_ids.include?(id)
        self.products.create(:category => id)
      end
    end
  end

  protected
  def validate_presence_of_product_categories
    if self.products.reject(&:marked_for_destruction?).length < 1
      self.errors.add(:productCategoryIds, "at least one productCategorieId must be given")
    end
  end
end