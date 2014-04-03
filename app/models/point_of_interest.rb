class PointOfInterest < ActiveRecord::Base
	#GEO_FACTORY = RGeo::Geographic.spherical_factory(:srid => 4326)

  attr_accessible :name, :address, :lat, :lon, :type
	#set_rgeo_factory_for_column(:location, GEO_FACTORY)
  #after_initialize :init_location

  has_detail_infos
  
 	#scope :nearby, lambda{ |lat, lon, radius| where("ST_DWithin(location, ST_GeomFromText('POINT (? ?)', 4326), ?)", lon.to_f, lat.to_f, radius)}
  
  validates :name, presence: true
  validates :address, presence: true
  validates :lat, presence: true, numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validates :lon, presence: true, numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}
 	#validates :location, :presence => true

	# #attr_accessors for lat
 #  def lat
	# 	self.location.lat
 #  end

 #  def lat=(val)
 #    init_location
 #  	self.location = @location_factory.point(self.location.lon, val)
 #  end

 #  #attr_accessors for lon
	# def lon
	# 	self.location.lon
 #  end

 #  def lon=(val)
 #    init_location
 #  	self.location = @location_factory.point(val, self.location.lat)
 #  end


	# private
 #  def init_location
 #    @location_factory = PointOfInterest.rgeo_factory_for_column(:location)
 #    self.location ||= @location_factory.point(0, 0)
 #  end
end
