class PointOfSale < PointOfInterest
  SHOP_TYPE_NAMES = I18n.t("point_of_sale.shop_type_names")
  
  attr_accessible :shopTypeId, :openingTimes, :marketStalls
  
  alias_attribute :shopTypeId, :shop_type
  alias_attribute :openingTimes, :opening_times_attributes
  alias_attribute :marketStalls, :market_stalls_attributes
  
  #relations
  has_many :opening_times, :dependent => :destroy
  accepts_nested_attributes_for :opening_times, :allow_destroy => true, :reject_if => lambda { |ot| ot[:from].blank? && ot[:to].blank?}
  
  has_many :market_stalls, :dependent => :destroy, :inverse_of => :point_of_sale
  accepts_nested_attributes_for :market_stalls, :allow_destroy => true, :reject_if => :all_blank

  sells_products

  #scopes
  default_scope includes(:opening_times)
  
  #validations
  validates :shop_type, :presence => true, :numericality => { :only_integer => true, :less_than => SHOP_TYPE_NAMES.length }
end
