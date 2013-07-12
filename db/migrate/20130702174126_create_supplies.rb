class CreateSupplies < ActiveRecord::Migration
  def change
    create_table :supplies do |t|
      t.references :point_of_production
      t.references :product
      t.float :distance

      t.timestamps
    end
    add_index :supplies, :point_of_production_id
    add_index :supplies, :product_id
  end
end
