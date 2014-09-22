#encoding: utf-8
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

PointOfSale.destroy_all
Status.delete_all

approved = Status.create!(
	:name => "approved"
)
Status.create!([{ name: 'pending' }, { name: 'not approved' }])

CSV.foreach("lib/data/pos.csv", :headers => :first_row) do |row|
	PointOfSale.create!( :name => row[0], 
				 	:address => row[1], 
					:posTypeId => row[2],
			 		:productCategoryIds => row[3].split(",").map { |s| s.to_i },
 					:openingTimes => row[4].split(",").map{ |day| {:dayId=>day.split("=")[0].to_i, :from=>day.split("=")[1].split("-")[0], :to=>day.split("=")[1].split("-")[1]}},
					:description => row[5], 
					:website => row[6],
					:mail => row[7],
					:phone => row[8],
					:cell_phone => row[9],
 					:marketStalls => [],
 					:status_id => approved.id
 					#[
 					#	{:name => "standXaufMarkt#{i}", 
 					#	:phone => "12345678", 
 					#	:productCategoryIds => [rand(0..7), 3]}, 
					#	{:name => "standYaufMarkt#{i}",
					#	 :phone => "12345678",
					#	 :productCategoryIds => [3]}
					#]
				)
end




