class CreatePlaceFeaturesPointOfInterests < ActiveRecord::Migration
	#drop_table 'place_features_point_of_interests' unless !ActiveRecord::Base.connection.table_exists? 'place_features_point_of_interests'
  def change
    create_table :place_features_point_of_interests, id: false do |t|
      t.references :place_feature, :point_of_interest
    end
  end
end
