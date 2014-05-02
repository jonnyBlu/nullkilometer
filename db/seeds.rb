#encoding: utf-8
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


#TODO 1: empty tables Market and Shop if exist
CSV.foreach("lib/data/market.csv", :headers => :first_row) do |row|
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
 					:marketStalls => []
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

#CSV.foreach("#{RAILS_ROOT}/lib/data/shops.csv", :headers => :first_row) do |row|
#	PointOfSale.create!( 	:name => row[0], 
#					:address => row[0], 
#					:lat => lat, 
#					:lon => lon, 
#					:posTypeId => row[0],
#		 			:productCategoryIds => [rand(0..7), rand(0..7), rand(0..7), 3],
#					:openingTimes => [{:dayId => 2, :from => "10:00", :to => "17:00"}, {:dayId => 3, :from => "10:00", :to => "17:00"}],
#					:description => row[0], 
#					:mail => row[0],
#					:website => row[0],
#					:phone => row[0],
#					:cell_phone => row[0]
#				)
#end

