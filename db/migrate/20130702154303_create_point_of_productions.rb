class CreatePointOfProductions < ActiveRecord::Migration
  def change
    create_table :point_of_productions do |t|
      t.string :name

      t.timestamps
    end
  end
end
