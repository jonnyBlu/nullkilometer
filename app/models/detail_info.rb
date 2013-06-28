class DetailInfo < ActiveRecord::Base
  attr_accessible :description, :mail, :phone, :website

  belongs_to :detailable, :polymorphic => true
end
