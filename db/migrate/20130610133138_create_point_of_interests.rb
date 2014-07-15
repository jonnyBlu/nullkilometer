class CreatePointOfInterests < ActiveRecord::Migration
  def change
    create_table :point_of_interests do |t|
      t.string :name
      t.string :address
      t.float :lat
      t.float :lon
      t.integer :pos_type
      t.string :type
      t.integer :status

      t.timestamps
    end
  end
end
