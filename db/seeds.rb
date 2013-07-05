#encoding: utf-8
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

for i in (1..10)
	producer = PointOfProduction.create!(:name => "producer#{i}")
end

for i in (1..5)
  lat = rand * 7.5 + 47.55  #between 47,5 and 55,0 with 8 after-comma-digits
	lon = rand * 9.0 + 6.0    #between 6,0 and 15,0 with 8 after-comma-digits
	market = PointOfSale.create!(:name => "markt#{i}", 
														:address => "test address", 
																:lat => lat, 
																:lon => lon, 
													:shop_type => 1,
								:products_attributes => [{:category => rand(1..7), :productions_attributes => [{:point_of_production_id => rand(1..10)},
																																															 {:point_of_production_id => rand(1..10)}]}, 
																				 {:category => rand(1..7), :productions_attributes => [{:point_of_production_id => rand(1..10)}]}, 
																				 {:category => rand(1..7), :productions_attributes => [{:point_of_production_id => rand(1..10)}]}],
					 :opening_times_attributes => [{:day => 4, :from => "10:00", :to => "17:00"}, {:day => 0, :from => "10:00", :to => "17:00"}],
												:description => "xxx", 
															 :mail => "mail@markt#{i}.de",
														:website => "http://www.markt#{i}.de",
					 :market_stalls_attributes => [{:name => "standXaufMarkt#{i}", 
					 																:phone => "12345678", 
					 																:products_attributes => [{:category => rand(1..7), :productions_attributes => [{:point_of_production_id => rand(1..10)},
																																																												 {:point_of_production_id => rand(1..10)}]}]}, 
																				 {:name => "standYaufMarkt#{i}", :phone => "12345678"}])
end

for i in (1..10)
	lat = rand * 7.5 + 47.55  #between 47,5 and 55,0 with 8 after-comma-digits
	lon = rand * 9.0 + 6.0    #between 6,0 and 15,0 with 8 after-comma-digits
	shop = PointOfSale.create!(:name => "shop#{i}", 
														:address => "test address", 
																:lat => lat, 
																:lon => lon, 
													:shop_type => rand(1..4),
								:products_attributes => [{:category => rand(1..7), :productions_attributes => [{:point_of_production_id => rand(1..10)},
																																															 {:point_of_production_id => rand(1..10)}]}, 
																				 {:category => rand(1..7), :productions_attributes => [{:point_of_production_id => rand(1..10)}]}, 
																				 {:category => rand(1..7), :productions_attributes => [{:point_of_production_id => rand(1..10)}]}],
								:products_attributes => [{:category => rand(1..7)}, {:category => rand(1..7)}, {:category => rand(1..7)}],
					 :opening_times_attributes => [{:day => 2, :from => "10:00", :to => "17:00"}, {:day => 3, :from => "10:00", :to => "17:00"}],
												:description => "xxx", 
															 :mail => "mail@shop#{i}.de",
														:website => "http://www.shop#{i}.de",
															:phone => "12345677890")
end
