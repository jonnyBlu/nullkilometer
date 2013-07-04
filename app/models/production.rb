class ProductionAssignment < ActiveRecord::Base
  belongs_to :point_of_production
  belongs_to :sales_assignment
end
