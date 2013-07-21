#encoding: utf-8
class Product < ActiveRecord::Base
	CATEGORY_NAMES = ["Milchprodukte", "Obst und Gemüse", "Fisch", "Fleisch", "Eier", "Konserven", "Brot", "Getrocknete Waren"]
  
  attr_accessible :category, :point_of_productions

  belongs_to :seller, :polymorphic => true
  has_many :supplies, :dependent => :destroy
  has_many :point_of_productions, :through => :supplies

  scope :for_seller, lambda { |seller_type, seller_id| where(["seller_type = ? and seller_id = ?", seller_type, seller_id])}

  validates :category, :presence => true
end