class CreateProductAssignments < ActiveRecord::Migration
  def change
    create_table :product_assignments do |t|
      t.references :point_of_sale
      t.integer :product_category_id

      t.timestamps
    end
  end
end
