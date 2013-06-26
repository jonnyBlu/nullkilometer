class CreateProductAssignments < ActiveRecord::Migration
  def change
    create_table :product_assignments do |t|
      t.references :point_of_sale
      t.references :product_category

      t.timestamps
    end
  end
end
