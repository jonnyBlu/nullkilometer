class AddStatusToMarketStalls < ActiveRecord::Migration
  def change
    add_column :market_stalls, :status_id, :integer
  end
end
