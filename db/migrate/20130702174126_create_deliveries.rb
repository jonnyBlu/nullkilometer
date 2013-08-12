class CreateDeliveries < ActiveRecord::Migration
  def change
    create_table :deliveries do |t|
      t.references :point_of_production
      t.references :product
      t.float :distance

      t.timestamps
    end
    add_index :deliveries, :point_of_production_id
    add_index :deliveries, :product_id
  end
end
