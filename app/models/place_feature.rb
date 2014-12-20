class PlaceFeature < ActiveRecord::Base

  has_and_belongs_to_many :point_of_interest
  attr_accessible :name

end