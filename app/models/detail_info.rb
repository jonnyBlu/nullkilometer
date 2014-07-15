class DetailInfo < ActiveRecord::Base

	has_paper_trail

  attr_accessible :description, :mail, :phone, :cell_phone, :website
  alias_attribute :cellPhone, :cell_phone

  belongs_to :detailable, :polymorphic => true

  validates :mail, :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i }, :allow_blank => true
  validates :phone, :format => { :with => /\A\+?[\d -]+\Z/}, :allow_blank => true
  validates :cell_phone, :format => { :with => /\A\+?[\d -]+\Z/}, :allow_blank => true
  validates :website, :url => true, :allow_blank => true
end
