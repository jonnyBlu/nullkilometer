class Supply < ActiveRecord::Base
	attr_accessible :pointOfProduction, :pointOfSale, :marketStall, :category, :product, :distance

	attr_accessor :category

	alias_attribute :pointOfProduction, :point_of_production_id
	alias_attribute :pointOfSale, :point_of_sale
	alias_attribute :marketStall, :market_stall

  belongs_to :point_of_production
  belongs_to :product

  after_initialize :set_product
  after_initialize :set_distance

  def point_of_sale=(val)
  	@seller = {:type => "PointOfSale", :id => val}
  end

  def point_of_sale
  	if product.seller_type == "PointOfSale"
  		product.seller
  	elsif product.seller_type == "MarketStall"
      product.seller.point_of_sale
    end
  end

  def market_stall=(val)
 		@seller = {:type => "MarketStall", :id => val}  	
  end

  private
  def set_product
  	self.product_id ||= Product.find_by_seller_type_and_seller_id_and_category(@seller[:type], @seller[:id], category).id if self.new_record?
  end

  def set_distance
   	self.distance ||= point_of_production.latlon.distance(point_of_sale.latlon)/1000 if self.new_record?
  end  
end
