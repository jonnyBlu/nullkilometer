class MarketStall < ActiveRecord::Base
  attr_accessible :name
  
  belongs_to :point_of_sale
  has_detail_infos
end
