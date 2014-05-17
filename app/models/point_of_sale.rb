class PointOfSale < PointOfInterest
  POS_TYPE_NAMES = I18n.t("point_of_sale.pos_type_names")
  
  attr_accessible :posTypeId, :openingTimes, :marketStalls, :opening_times_attributes
  
  alias_attribute :posTypeId, :pos_type
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
  validates :pos_type, :presence => true, :numericality => { :only_integer => true, :less_than => POS_TYPE_NAMES.length }
end
