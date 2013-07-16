class CreatePointOfInterests < ActiveRecord::Migration
  def change
    create_table :point_of_interests do |t|
      t.string :name
      t.string :address
      t.point :latlon, :geographic => true
      t.integer :shop_type
      t.string :type

      t.timestamps
    end
  end
end
