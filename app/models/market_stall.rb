class MarketStall < ActiveRecord::Base
  attr_accessible :name
  
  belongs_to :point_of_sale, :inverse_of => :market_stalls
  
  sells_products
  has_detail_infos

  validates :name, :presence => true
  validate :point_of_sale_must_be_market, :on => :create

  protected
  def point_of_sale_must_be_market
  	point_of_sale.errors.add(:pos_type, "Must be a market to have stalls") unless point_of_sale.pos_type == 0
  end

end
