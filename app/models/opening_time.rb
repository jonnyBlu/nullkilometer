class OpeningTime < ActiveRecord::Base
  belongs_to :point_of_sale
  
  attr_accessible :day, :close_at, :open_at

  validates :day, :close_at, :open_at, :presence => true
  validates :day, :numericality => { :only_integer => true, :less_than => 7}
  validates :open_at, :close_at, :format => { :with => /\d{2}:\d{2}/ }
end
