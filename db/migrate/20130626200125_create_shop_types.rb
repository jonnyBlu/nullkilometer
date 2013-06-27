class CreateShopTypes < ActiveRecord::Migration
  def change
    create_table :shop_types do |t|
      t.string :name

      t.timestamps
    end
  end
end
