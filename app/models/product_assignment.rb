class ProductAssignment < ActiveRecord::Base
  attr_accessible :point_of_sale, :product_categorie

  belongs_to :point_of_sale
  belongs_to :product_category
end
