class OpeningTime < ActiveRecord::Base
	#WEEK_DAY_NAMES = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]

  belongs_to :point_of_sale
  
  attr_accessible :day, :to, :from

  validates :day, :to, :from, :presence => true
  validates :day, :numericality => { :only_integer => true, :less_than => 7}
  validates :from, :to, :format => { :with => /([0-1]\d|2[0-3]):[0-5]\d/ }
  validate :cant_close_before_open
  #validate :at_least_one_opening_day


  protected
  def cant_close_before_open
    #TODO does not work
    errors.add(:to, "to is not defined") if to.nil? 
  	errors.add(:from, I18n.t("errors.messages.opening_time_before_closing_time")) if from.gsub(/:/,'').to_i >= to.gsub(/:/,'').to_i
  end

  #protected
  #def at_least_one_opening_day
   # errors.add(:from, "at least one opening day (with opening times) must be set") 
  #end
end
