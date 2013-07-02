class CreateSalesAssignments < ActiveRecord::Migration
  def change
    create_table :sales_assignments do |t|
      t.integer :product_category
      t.references :assignable, :polymorphic => true

      t.timestamps
    end
  end
end
