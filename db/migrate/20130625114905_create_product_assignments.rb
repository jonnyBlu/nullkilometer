class CreateProductAssignments < ActiveRecord::Migration
  def change
    create_table :product_assignments do |t|
      t.integer :product_category
      t.references :assignable, :polymorphic => true

      t.timestamps
    end
  end
end
