class PointOfProduction < ActiveRecord::Base
  attr_accessible :name

  has_many :productions, :dependent => :destroy 
end
