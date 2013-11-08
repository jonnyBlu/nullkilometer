class DetailInfo < ActiveRecord::Base
  attr_accessible :description, :mail, :phone, :website

  belongs_to :detailable, :polymorphic => true

  validates :mail, :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i }, :allow_blank => true
  validates :phone, :format => { :with => /\A\+?[\d -]+\Z/}, :allow_blank => true
  validates :website, :url => true, :allow_blank => true
end
