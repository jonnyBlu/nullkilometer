class Status < ActiveRecord::Base
  has_many :point_of_interests
  attr_accessible :name
end