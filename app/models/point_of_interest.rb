class PointOfInterest < ActiveRecord::Base
  
  #http://www.sitepoint.com/versioning-papertrail/
  has_paper_trail

  belongs_to :status
	
  attr_accessible :name, :address, :lat, :lon, :type, :status_id
  geocoded_by :address, :latitude  => :lat, :longitude => :lon	

  has_detail_infos

  after_initialize :init_location
  
  def init_location 
    puts "INIT LOCATION"
  	#if self.lat==nil or self.lon==nil
  		if self.address
  			latlon= Geocoder.coordinates(self.address)
        puts "LAT LON of #{name}: #{latlon}"
        if latlon
  			  self.lat=latlon[0]
  			  self.lon=latlon[1]
        end
  		end
	  #end  	
  end
   
  validates_presence_of :name, :address
  validate :validate_location
 
  #validate :validate_location_boundaries #does not work
  validate :lat, numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validate :lon, numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}

  after_validation :log_errors, :if => Proc.new {|m| m.errors}

  private
  def validate_location
    unless lat.present? && lon.present?
      errors[:base] << I18n.t("errors.messages.wrong_address") 
      #"Address is not valid"
      # errors.add(:lat, "can't be blank")
      # errors.add(:lon, "can't be blank")
    end
  end

  def validate_location_boundaries
    #does not work
    if errors.blank?
    #  validate :lat, numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
    #  validate :lon, numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}
    end
  end


  def log_errors
    logger.error "#{self.name}: "+self.errors.full_messages.join("\n")
  end

end
