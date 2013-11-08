class PointOfProduction < PointOfInterest
	default_scope includes(:deliveries)

  has_many :deliveries, :dependent => :destroy 

  def delivery product_id
  	deliveries.find{ |delivery|
  		delivery.product_id == product_id
  	}
  end
end
