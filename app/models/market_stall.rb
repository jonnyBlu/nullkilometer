class MarketStall < ActiveRecord::Base
  attr_accessible :name
  
  belongs_to :point_of_sale
  has_product_assignments
  has_detail_infos
end
