class OpeningTime < ActiveRecord::Base
	WEEK_DAY_NAMES = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]

  belongs_to :point_of_sale
  
  attr_accessible :day, :to, :from
  alias_attribute :dayId, :day

  validates :day, :to, :from, :presence => true
  validates :day, :numericality => { :only_integer => true, :less_than => 7}
  validates :from, :to, :format => { :with => /\d{2}:\d{2}/ }
end
