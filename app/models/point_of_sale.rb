class PointOfSale < PointOfInterest
  SHOP_TYPE_NAMES=["Laden", "Markt", "Supermarkt", "Kiosk", "Bauernhofladen"]
  
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

  # #attributes for json-representation
  # def opening_times_day_array
  #   @opening_times_day_array ||= opening_times.map(&:day)
  #   # @opening_times_day_array ||= opening_times.map{|ot| OpeningTime::WEEK_DAY_NAMES.at(ot.day)}
  # end

  # def shop_type_name
  #   @shop_type_name ||= SHOP_TYPE_NAMES[shop_type]
  # end

  # def opening_times_string
  #   @opening_times_string ||= opening_times.map do|opening_time| 
  #     OpeningTime::WEEK_DAY_NAMES[opening_time.day]+": "+opening_time.from+" - "+opening_time.to
  #   end
  # end

end
