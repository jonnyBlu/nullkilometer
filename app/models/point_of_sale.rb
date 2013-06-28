class PointOfSale < ActiveRecord::Base
  #class methods
  def self.shop_type_names
    ["Laden", "Markt", "Supermarkt", "Kiosk", "Bauernhofladen"]
  end

  def self.init_detail_info_attributes
    detail_info_attributes = DetailInfo.content_columns.map(&:name) - ["created_at", "updated_at", "detailable_type"]
    detail_info_attributes.each do |att|
      define_method(att) do
        detail_info.send(att)
      end
      define_method("#{att}=") do |val|
        detail_info.send("#{att}=",val)
      end
    end
  end

  #building detail_infos
  def detail_info_with_build
    detail_info_without_build || build_detail_info
  end

  #accessible attributes
  attr_accessible :address, :lat, :lon, :name, :shop_type, :opening_times, 
                  :opening_times_attributes, :product_assignments_attributes
  attr_accessible :description, :mail, :phone, :website
  
  #relations
  has_many :opening_times, :dependent => :destroy
  has_many :product_assignments, :dependent => :destroy
  has_one :detail_info, :as => :detailable, :autosave => true, :dependent => :destroy

  #relation nesting
  accepts_nested_attributes_for :opening_times, :allow_destroy => true, :reject_if => lambda { |ot| ot[:from].blank? && ot[:to].blank?}
  accepts_nested_attributes_for :product_assignments, :allow_destroy => true, :reject_if => lambda { |pa| pa[:product_category].blank?}
  alias_method_chain :detail_info, :build

  #scopes

  #validations
  validates :address, :presence => true
  validates :latlon, :presence => true
  validates :name, :presence => true
  validates :shop_type, :presence => true, :numericality => { :only_integer => true, :less_than => PointOfSale.shop_type_names.length }

  
  #initializations
  init_detail_info_attributes
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
    # @opening_times_day_array ||= opening_times.map{|ot| OpeningTime.week_day_names.at(ot.day)}
  end

  def product_category_id_array
    @product_category_id_array ||= product_assignments.map(&:product_category) 
  end

  def shop_type_name
    @shop_type_name ||= PointOfSale.shop_type_names[shop_type]
  end

  def opening_times_string
    @opening_times_string ||= opening_times.map do|opening_time| 
      OpeningTime.week_day_names[opening_time.day]+": "+opening_time.from+" - "+opening_time.to
    end
  end
end
