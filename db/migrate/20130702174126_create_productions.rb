class CreateProductions < ActiveRecord::Migration
  def change
    create_table :productions do |t|
      t.references :point_of_production
      t.references :product

      t.timestamps
    end
    add_index :productions, :point_of_production_id
    add_index :productions, :product_id
  end
end
