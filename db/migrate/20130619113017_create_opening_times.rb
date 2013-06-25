class CreateOpeningTimes < ActiveRecord::Migration
  def change
    create_table :opening_times do |t|
      t.references :point_of_sale
      t.integer :day
      t.string :open_at
      t.string :close_at

      t.timestamps
    end
    add_index :opening_times, :point_of_sale_id
  end
end
