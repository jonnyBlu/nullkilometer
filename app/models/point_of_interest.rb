class PointOfInterest < ActiveRecord::Base
  
  #http://www.sitepoint.com/versioning-papertrail/
  has_paper_trail

  belongs_to :status
	
  attr_accessible :name, :address, :lat, :lon, :type, :status_id
  geocoded_by :address, :latitude  => :lat, :longitude => :lon	

  has_detail_infos

  after_initialize :init_location
  
  def init_location 
  	if self.lat==nil or self.lon==nil
  		if self.address
  			latlon= Geocoder.coordinates(self.address)
        puts "LAT LON of"
        puts name
        puts latlon
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

  after_validation :log_errors, :if => Proc.new {|m| m.errors}
  def log_errors
    logger.error "#{self.name}: "+self.errors.full_messages.join("\n")
  end

end
