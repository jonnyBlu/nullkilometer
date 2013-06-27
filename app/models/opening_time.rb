class OpeningTime < ActiveRecord::Base
  belongs_to :point_of_sale
  
  attr_accessible :day, :to, :from

  validates :day, :to, :from, :presence => true
  validates :day, :numericality => { :only_integer => true, :less_than => 7}
  validates :from, :to, :format => { :with => /\d{2}:\d{2}/ }

  def self.week_day_names
  	["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
  end
end
