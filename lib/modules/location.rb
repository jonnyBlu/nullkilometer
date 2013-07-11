module Location
	GEO_FACTORY = RGeo::Geographic.spherical_factory(:srid => 4326)

	def self.included base
		base.attr_accessible :name, :address, :lat, :lon
		base.set_rgeo_factory_for_column(:latlon, GEO_FACTORY)
  	base.after_initialize :init_latlon
  	base.class_eval do
  		scope :nearby, lambda{ |lat, lon, distance| where("ST_DWithin(latlon, ST_GeomFromText('POINT (? ?)', 4326), ?)", lon.to_f, lat.to_f, distance)}
  	end
    base.validates :name, :presence => true
    base.validates :address, :presence => true
  	base.validates :latlon, :presence => true
  end

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
    @latlon_factory = PointOfSale.rgeo_factory_for_column(:latlon)
    self.latlon ||= @latlon_factory.point(0, 0)
  end
end