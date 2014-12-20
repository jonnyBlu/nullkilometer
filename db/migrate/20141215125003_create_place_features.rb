class CreatePlaceFeatures < ActiveRecord::Migration
  def change
    create_table :place_features do |t|
      t.string :name
    end
  end
end