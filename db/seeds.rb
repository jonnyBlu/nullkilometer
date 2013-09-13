#encoding: utf-8
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

for i in (1..10)
	lat = rand * 7.5 + 47.55  #between 47,5 and 55,0 with 8 after-comma-digits
	lon = rand * 9.0 + 6.0    #between 6,0 and 15,0 with 8 after-comma-digits
	producer = PointOfProduction.create!(:name => "producer#{i}",
																		:address => "bauer test address",
																				:lat => lat,
																				:lon => lon)
end

for i in (1..5)
  lat = rand * 7.5 + 47.55  #between 47,5 and 55,0 with 8 after-comma-digits
	lon = rand * 9.0 + 6.0    #between 6,0 and 15,0 with 8 after-comma-digits
	market = Market.create!( :name => "markt#{i}", 
												:address => "test address", 
														:lat => lat, 
														:lon => lon, 
										  :posTypeId => 0,
						 :productCategoryIds => [rand(0..7), rand(0..7), rand(0..7), 3],
			 						 :openingTimes => [{:dayId => 4, :from => "10:00", :to => "17:00"}, {:dayId => 0, :from => "10:00", :to => "17:00"}],
										:description => "xxx", 
													 :mail => "mail@markt#{i}.de",
												:website => "http://www.markt#{i}.de",
			 						 :marketStalls => [{:name => "standXaufMarkt#{i}", 
			 																:phone => "12345678", 
			 																:productCategoryIds => [rand(0..7), 3]}, 
																		 {:name => "standYaufMarkt#{i}",
																		  :phone => "12345678",
																		  :productCategoryIds => [3]}])
end

for i in (1..10)
	lat = rand * 7.5 + 47.55  #between 47,5 and 55,0 with 8 after-comma-digits
	lon = rand * 9.0 + 6.0    #between 6,0 and 15,0 with 8 after-comma-digits
	shop = Shop.create!( :name => "shop#{i}", 
										:address => "test address", 
												:lat => lat, 
												:lon => lon, 
								  :posTypeId => rand(1..3),
				 :productCategoryIds => [rand(0..7), rand(0..7), rand(0..7), 3],
	 						 :openingTimes => [{:dayId => 2, :from => "10:00", :to => "17:00"}, {:dayId => 3, :from => "10:00", :to => "17:00"}],
								:description => "xxx", 
											 :mail => "mail@shop#{i}.de",
										:website => "http://www.shop#{i}.de",
											:phone => "12345677890")
end

for i in (1..20)
	if rand(1..10)<8
		delivery = Delivery.create!(:pointOfSaleId => rand(11..25),
											 				 	 :category => 3,
											:pointOfProductionId => rand(1..10)) 
	else
		delivery = Delivery.create!(:marketStallId => rand(1..10),
											 				 	 :category => 3,
											:pointOfProductionId => rand(1..10)) 
	end
	
end
