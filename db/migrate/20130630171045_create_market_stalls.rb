class CreateMarketStalls < ActiveRecord::Migration
  def change
    create_table :market_stalls do |t|
      t.string :name
      t.references :market

      t.timestamps
    end
    add_index :market_stalls, :market_id
  end
end
