class Market < PointOfSale

	attr_accessible :marketStalls
	alias_attribute :marketStalls, :market_stalls_attributes

	has_many :market_stalls, :dependent => :destroy, :inverse_of => :market
  accepts_nested_attributes_for :market_stalls, :allow_destroy => true, :reject_if => :all_blank
end