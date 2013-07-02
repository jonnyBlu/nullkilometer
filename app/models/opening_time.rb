class OpeningTime < ActiveRecord::Base
	WEEK_DAY_NAMES = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]

  belongs_to :point_of_sale
  
  attr_accessible :day, :to, :from
  alias_attribute :dayId, :day

  validates :day, :to, :from, :presence => true
  validates :day, :numericality => { :only_integer => true, :less_than => 7}
  validates :from, :to, :format => { :with => /([0-1]\d|2[0-3]):[0-5]\d/ }
  validate :cant_close_before_open

  protected
  def cant_close_before_open
  	errors.add(:from, "must be bevore closing time") if from.gsub(/:/,'').to_i >= to.gsub(/:/,'').to_i
  end
end
