class CreateMarketStalls < ActiveRecord::Migration
  def change
    create_table :market_stalls do |t|
      t.string :name
      t.references :point_of_sale

      t.timestamps
    end
    add_index :market_stalls, :point_of_sale_id
  end
end
