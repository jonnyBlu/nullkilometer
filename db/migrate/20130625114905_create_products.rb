class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|
      t.integer :category
      t.references :seller, :polymorphic => true

      t.timestamps
    end
  end
end
