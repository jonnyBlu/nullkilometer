class CreateDetailInfos < ActiveRecord::Migration
  def change
    create_table :detail_infos do |t|
      t.string :website
      t.string :mail
      t.string :phone
      t.text :description
      t.references :detailable, polymorphic: true

      t.timestamps
    end
  end
end
