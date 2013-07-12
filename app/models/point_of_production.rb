class PointOfProduction < ActiveRecord::Base
	default_scope includes(:supplies)

  has_many :supplies, :dependent => :destroy 

  is_location

  def supply product_id
  	supplies.find{ |supply|
  		supply.product_id == product_id
  	}
  end
end
