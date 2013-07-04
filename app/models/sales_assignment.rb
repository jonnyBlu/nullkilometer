#encoding: utf-8
class SalesAssignment < ActiveRecord::Base
	PRODUCT_CATEGORY_NAMES = ["Milchprodukte", "Obst und Gemüse", "Fisch", "Fleisch", "Eier", "Konserven", "Brot", "Getrocknete Waren"]
  
  attr_accessible :product_category

  belongs_to :assignable, :polymorphic => true
  has_many :productions, :dependent => :destroy
  has_many :point_of_productions, :through => :productions
end