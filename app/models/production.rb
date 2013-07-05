class Production < ActiveRecord::Base
	attr_accessible :point_of_production_id

  belongs_to :point_of_production
  belongs_to :product
end
