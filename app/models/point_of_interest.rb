class PointOfInterest < ActiveRecord::Base
	GEO_FACTORY = RGeo::Geographic.spherical_factory(:srid => 4326)

  attr_accessible :name, :address, :lat, :lon, :type
	set_rgeo_factory_for_column(:latlon, GEO_FACTORY)
  after_initialize :init_latlon

  has_detail_infos
  
 	scope :nearby, lambda{ |lat, lon, radius| where("ST_DWithin(latlon, ST_GeomFromText('POINT (? ?)', 4326), ?)", lon.to_f, lat.to_f, radius)}
  
  validates :name, :presence => true
  validates :address, :presence => true
 	validates :latlon, :presence => true

	#attr_accessors for lat
  def lat
		self.latlon.lat
  end

  def lat=(val)
    init_latlon
  	self.latlon = @latlon_factory.point(self.latlon.lon, val)
  end

  #attr_accessors for lon
	def lon
		self.latlon.lon
  end

  def lon=(val)
    init_latlon
  	self.latlon = @latlon_factory.point(val, self.latlon.lat)
  end

	private
  def init_latlon
    @latlon_factory = PointOfInterest.rgeo_factory_for_column(:latlon)
    self.latlon ||= @latlon_factory.point(0, 0)
  end
end
