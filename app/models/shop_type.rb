class ShopType < ActiveRecord::Base
  attr_accessible :name
  has_many :point_of_sales
end
