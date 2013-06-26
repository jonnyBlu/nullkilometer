class ProductAssignment < ActiveRecord::Base
  attr_accessible :point_of_sale, :product_category_id

  belongs_to :point_of_sale

  validates :point_of_sale, :product_category_id, :presence => true
  validates :product_category_id, :numericality => { :only_integer => true, :less_than_or_equal_to => self.product_categories.length }

  def self.product_categories
  	["Milchprodukte", "Obst und Gemüse", "Fisch", "Fleisch", "Eier", "Konserven", "Brot", "Getrocknete Waren"]
  end
end
