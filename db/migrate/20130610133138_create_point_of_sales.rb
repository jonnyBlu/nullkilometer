class CreatePointOfSales < ActiveRecord::Migration
  def change
    create_table :point_of_sales do |t|
      t.string :name
      t.string :address
      t.point :latlon, :geographic => true
      t.integer :shop_type

      t.timestamps
    end
  end
end
