#encoding: utf-8
class Product < ActiveRecord::Base
	CATEGORY_NAMES = ["Milchprodukte", "Obst und Gemüse", "Fisch", "Fleisch", "Eier", "Konserven", "Brot", "Getrocknete Waren"]
  
  attr_accessible :category, :productions_attributes

  belongs_to :seller, :polymorphic => true
  has_many :productions, :dependent => :destroy
  has_many :point_of_productions, :through => :productions

  accepts_nested_attributes_for :productions, :allow_destroy => true, :reject_if => :all_blank

  scope :for_seller, lambda { |seller_type, seller_id| where(["seller_type = ? and seller_id = ?", seller_type, seller_id])}
end