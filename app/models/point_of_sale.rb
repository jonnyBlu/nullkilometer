class PointOfSale < ActiveRecord::Base
  attr_accessible :address, :latlon, :latitude, :longitude, :name, :opening_time, :type_of_POS

  set_rgeo_factory_for_column(:latlon, RGeo::Geographic.spherical_factory(:srid => 4326))

  after_initialize :init_latlon

  validates :address, :presence => true
  validates :name, :presence => true
  validates :opening_time, :presence => true
  validates :type_of_POS, :presence => true

  
  def init_latlon
  	self.latlon ||= PointOfSale.rgeo_factory_for_column(:latlon).point(0, 0)
  end

  #acessing latitude and longitude:
  def latitude
		self.latlon.lat
  end

  def latitude=(val)
    init_latlon
  	longitude = self.latlon.lon
  	self.latlon = PointOfSale.rgeo_factory_for_column(:latlon).point(longitude, val)
  end

	def longitude
		self.latlon.lon
  end

  def longitude=(val)
    init_latlon
  	latitude = self.latlon.lat
  	self.latlon = PointOfSale.rgeo_factory_for_column(:latlon).point(val, latitude)
  end  

end
