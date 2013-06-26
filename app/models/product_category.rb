class ProductCategory < ActiveRecord::Base
  attr_accessible :name

  has_many :product_assignments, :dependent => :destroy
  has_many :point_of_sales, :through => :product_assignments
end
