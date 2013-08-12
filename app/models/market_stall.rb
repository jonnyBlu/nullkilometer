class MarketStall < ActiveRecord::Base
  attr_accessible :name
  
  belongs_to :market, :inverse_of => :market_stalls
  sells_products
  has_detail_infos

  validates :name, :presence => true
  #validate :point_of_sale_must_be_market, :on => :create

  # protected
  # def point_of_sale_must_be_market
  # 	market.errors.add(:pos_type, "must be a market to have stalls") unless market.pos_type == 0
  # end
end
