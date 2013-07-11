class PointOfProduction < ActiveRecord::Base
  has_many :productions, :dependent => :destroy 

  is_location
end
