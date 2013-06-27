class PointOfSale < ActiveRecord::Base
  attr_accessible :address, :lat, :lon, :name, :shop_type_id, :shop_type, :opening_times, 
                  :opening_times_attributes, :product_assignments_attributes
  
  #relations
  has_many :opening_times, :dependent => :destroy
  has_many :product_assignments, :dependent => :destroy
  belongs_to :shop_type

  #relation nesting
  accepts_nested_attributes_for :opening_times, :allow_destroy => true, :reject_if => lambda { |ot| ot[:from].blank? && ot[:to].blank?}
  accepts_nested_attributes_for :product_assignments, :allow_destroy => true, :reject_if => lambda { |pa| pa[:product_category].blank?}

  #scopes

  #validations
  validates :address, :presence => true
  validates :latlon, :presence => true
  validates :name, :presence => true
  validates :shop_type, :presence => true


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

 #getters for json-representation
  def opening_times_day_array
    @opening_times_day_array ||= opening_times.map(&:day)
    # @opening_times_day_array ||= opening_times.map{|ot| OpeningTime.week_day_names.at(ot.day)}
  end

  def product_category_id_array
    @product_category_id_array ||= product_assignments.map(&:product_category) 
  end

  def shop_type_name
    @shop_type_name ||= shop_type.name
  end

  def opening_times_string
    @opening_times_string ||= opening_times.map do|opening_time| 
      OpeningTime.week_day_names[opening_time.day]+": "+opening_time.from+" - "+opening_time.to
    end
    
  end
end
