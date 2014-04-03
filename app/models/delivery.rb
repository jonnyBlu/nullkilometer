class Delivery < ActiveRecord::Base
	attr_accessible :pointOfProductionId, :pointOfSaleId, :marketStallId, :category, :product, :distance

	attr_accessor :category

	alias_attribute :pointOfProductionId, :point_of_production_id
	alias_attribute :pointOfSaleId, :point_of_sale
	alias_attribute :marketStallId, :market_stall

  belongs_to :point_of_production
  belongs_to :product

  after_initialize :set_product
  after_initialize :set_distance

  validate :add_error_messages_for_invalid_attributes

  def market_stall=(val)
    begin
      @seller = MarketStall.find(val)
    rescue ActiveRecord::RecordNotFound
      @market_stall_invalid = "MarketStall with id=#{val} is invalid"
    end
  end

  def point_of_sale=(val)
    begin
      @seller = PointOfSale.find(val)
    rescue ActiveRecord::RecordNotFound
      @point_of_sale_invalid = "PointOfSale with id=#{val} is invalid"
    end
  end

  def point_of_sale
  	if product && product.seller_type == "PointOfInterest"
  		product.seller
  	elsif product && product.seller_type == "MarketStall"
      product.seller.market
    end
  end

  private
  def set_product
    if self.new_record? && @seller
      self.product = @seller.products.select{|p| p.category == category}.first
      @category_invalid = "ProductCategory with id=#{category} for #{@seller.class.name} with id=#{@seller.id} is invalid" unless product
    end
  end

  def set_distance
    if self.new_record?
     	begin
        #TODO: calculate the distance between POS and POP here!!
        #self.distance = point_of_production.location.distance(point_of_sale.location)/1000
      rescue
        @point_of_production_invalid = "PointOfProduction with id=#{point_of_production_id} is invalid"
      end
    end
  end 

  def add_error_messages_for_invalid_attributes
    self.errors.add(:point_of_sale, @point_of_sale_invalid) if @point_of_sale_invalid
    self.errors.add(:market_stall, @market_stall_invalid) if @market_stall_invalid  
    self.errors.add(:product_category, @category_invalid) if @category_invalid
    self.errors.add(:point_of_production, @point_of_production_invalid) if @point_of_production_invalid
  end
end
