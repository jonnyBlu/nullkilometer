class PointOfSale < ActiveRecord::Base
  attr_accessible :address, :latlon, :lat, :lon, :name, :opening_times, :opening_times_attributes, :open_on, :type_of_POS
  
  #relations
  has_many :opening_times, :dependent => :destroy

  #relation nesting
  accepts_nested_attributes_for :opening_times, :allow_destroy => true, :reject_if => lambda { |a| a[:open_at].blank? && a[:close_at].blank?}

  #scopes

  #validations
  validates :address, :presence => true
  validates :latlon, :presence => true
  validates :name, :presence => true
  validates :type_of_POS, :presence => true


  set_rgeo_factory_for_column(:latlon, RGeo::Geographic.spherical_factory(:srid => 4326))
  after_initialize :init_latlon

  
  def init_latlon
  	self.latlon ||= PointOfSale.rgeo_factory_for_column(:latlon).point(0, 0)
  end

  #attr_accessors for lat and lon:
  def lat
		self.latlon.lat
  end

  def lat=(val)
    init_latlon
  	self.latlon = PointOfSale.rgeo_factory_for_column(:latlon).point(self.latlon.lon, val)
  end

	def lon
		self.latlon.lon
  end

  def lon=(val)
    init_latlon
  	self.latlon = PointOfSale.rgeo_factory_for_column(:latlon).point(val, self.latlon.lat)
  end

  #for json outputs:
  def open_on
    # @open_on ||= object.opening_times.map(&:day)
    @open_on ||= opening_times.map{|ot| ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"].at(ot.day)}
  end
end