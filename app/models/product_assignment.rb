#encoding: utf-8
class ProductAssignment < ActiveRecord::Base
  attr_accessible :point_of_sale, :product_category

  belongs_to :point_of_sale

  def self.product_category_names
  	@product_category_names ||=  ["Milchprodukte", "Obst und Gemüse", "Fisch", "Fleisch", "Eier", "Konserven", "Brot", "Getrocknete Waren"];
  end
end
