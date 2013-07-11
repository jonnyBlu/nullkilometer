class CreatePointOfProductions < ActiveRecord::Migration
  def change
    create_table :point_of_productions do |t|
      t.string :name
      t.string :address
      t.point :latlon, :geographic => true

      t.timestamps
    end
  end
end
