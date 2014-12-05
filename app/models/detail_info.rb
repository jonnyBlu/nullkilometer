class DetailInfo < ActiveRecord::Base

	has_paper_trail

  attr_accessible :description, :mail, :phone, :cell_phone, :website
  alias_attribute :cellPhone, :cell_phone

  belongs_to :detailable, :polymorphic => true

	# add http if does not contain
	before_validation :smart_add_url_protocol

  validates :mail, :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i }, :allow_blank => true
  #how to allow everything but letters, !?
#  validates :phone, :format =>  :allow_blank => true
#  validates :cell_phone, :format => { :with => /\A\+?[\d -]+\Z/}, :allow_blank => true
  validates :website, :url => true, :allow_blank => true

	protected

	def smart_add_url_protocol
		unless self.website.blank?
		  unless self.website[/\Ahttp:\/\//] || self.website[/\Ahttps:\/\//]
		    self.website = "http://#{self.website}"
		  end
		end
	end

end
