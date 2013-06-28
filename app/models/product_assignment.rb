#encoding: utf-8
class ProductAssignment < ActiveRecord::Base
	PRODUCT_CATEGORY_NAMES = ["Milchprodukte", "Obst und Gemüse", "Fisch", "Fleisch", "Eier", "Konserven", "Brot", "Getrocknete Waren"]
  
  attr_accessible :point_of_sale, :product_category

  belongs_to :point_of_sale
end
