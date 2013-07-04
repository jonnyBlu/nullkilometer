class CreateProductions < ActiveRecord::Migration
  def change
    create_table :production do |t|
      t.references :point_of_production
      t.references :sales_assignment

      t.timestamps
    end
    add_index :production, :point_of_production_id
    add_index :production, :sales_assignment_id
  end
end
