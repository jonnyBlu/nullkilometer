class PointOfSale < PointOfInterest
  POS_TYPE_NAMES = I18n.t("point_of_sale.pos_type_names")
  
  def self.inherited(child)
    child.instance_eval do
      def model_name
        PointOfSale.model_name
      end
    end
    super
  end
  
  attr_accessible :posTypeId, :openingTimes
  
  alias_attribute :posTypeId, :pos_type
  alias_attribute :openingTimes, :opening_times_attributes
  
  #relations
  has_many :opening_times, :dependent => :destroy
  accepts_nested_attributes_for :opening_times, :allow_destroy => true, :reject_if => lambda { |ot| ot[:from].blank? && ot[:to].blank?}

  sells_products

  #scopes
  default_scope includes(:opening_times)
  
  #validations
  validates :pos_type, :presence => true, :numericality => { :only_integer => true, :less_than => POS_TYPE_NAMES.length }


end
