class PointOfSale < ActiveRecord::Base

  SHOP_TYPE_NAMES=["Laden", "Markt", "Supermarkt", "Kiosk", "Bauernhofladen"]

  attr_accessible :address, :lat, :lon, :name, :shop_type, 
                  :opening_times_attributes, :market_stalls_attributes
  
  alias_attribute :shopTypeId, :shop_type
  alias_attribute :openingTimes, :opening_times
  alias_attribute :marketStalls, :market_stalls
  
  #relations
  has_many :opening_times, :dependent => :destroy
  accepts_nested_attributes_for :opening_times, :allow_destroy => true, :reject_if => lambda { |ot| ot[:from].blank? && ot[:to].blank?}
  
  has_many :market_stalls, :dependent => :destroy, :inverse_of => :point_of_sale
  accepts_nested_attributes_for :market_stalls, :allow_destroy => true, :reject_if => :all_blank

  has_sales_assignments
  has_detail_infos

  #scopes

  #validations
  validates :address, :presence => true
  validates :latlon, :presence => true
  validates :name, :presence => true
  validates :shop_type, :presence => true, :numericality => { :only_integer => true, :less_than => SHOP_TYPE_NAMES.length }
  
  #initializations
  set_rgeo_factory_for_column(:latlon, RGeo::Geographic.spherical_factory(:srid => 4326))
  after_initialize :init_latlon

  def init_latlon
  	self.latlon ||= PointOfSale.rgeo_factory_for_column(:latlon).point(0, 0)
  end

  #attr_accessors for lat
  def lat
		self.latlon.lat
  end

  def lat=(val)
    init_latlon
  	self.latlon = PointOfSale.rgeo_factory_for_column(:latlon).point(self.latlon.lon, val)
  end

  #attr_accessors for lon
	def lon
		self.latlon.lon
  end

  def lon=(val)
    init_latlon
  	self.latlon = PointOfSale.rgeo_factory_for_column(:latlon).point(val, self.latlon.lat)
  end


  #attributes for json-representation
  def opening_times_day_array
    @opening_times_day_array ||= opening_times.map(&:day)
    # @opening_times_day_array ||= opening_times.map{|ot| OpeningTime::WEEK_DAY_NAMES.at(ot.day)}
  end

  def shop_type_name
    @shop_type_name ||= SHOP_TYPE_NAMES[shop_type]
  end

  def opening_times_string
    @opening_times_string ||= opening_times.map do|opening_time| 
      OpeningTime::WEEK_DAY_NAMES[opening_time.day]+": "+opening_time.from+" - "+opening_time.to
    end
  end
end
