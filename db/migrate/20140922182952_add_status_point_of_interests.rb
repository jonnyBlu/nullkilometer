class AddStatusPointOfInterests < ActiveRecord::Migration
  def change
		rename_column :point_of_interests, :status, :status_id 
		create_table :statuses do |t|
			t.string :name 
		end
  end
end
