class PointOfInterest < ActiveRecord::Base
	
  attr_accessible :name, :address, :lat, :lon, :type
  geocoded_by :address, :latitude  => :lat, :longitude => :lon	

  has_detail_infos

  after_initialize :init_location
  
  def init_location 
  	if self.lat==nil or self.lon==nil
  		if self.address
  			latlon= Geocoder.coordinates(self.address)
        if latlon
  			  self.lat=latlon[0]
  			  self.lon=latlon[1]
        end
  		end
	  end  	
  end
   
  validates :name, presence: true
  validates :address, presence: true
  validates :lat, presence: true, numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validates :lon, presence: true, numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}
end
