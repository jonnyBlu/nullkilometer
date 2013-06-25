class CreatePointOfSales < ActiveRecord::Migration
  def change
    create_table :point_of_sales do |t|
      t.string :name
      t.string :address
      t.point :latlon, :geographic => true
      t.string :type_of_POS
      t.text :description

      t.timestamps
    end
  end
end