#encoding: utf-8
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


product_categories = ProductCategory.create([{:name => "Milchprodukte"},
																						 {:name => "Obst und Gemüse"},
																						 {:name => "Fisch"},
																						 {:name => "Fleisch"},
																						 {:name => "Eier"},
																						 {:name => "Brot"},
																						 {:name => "Getrocknete Waren"}])

shop_types = ShopType.create([{:name => "Laden"},
															{:name => "Markt"},
															{:name => "Supermarkt"},
															{:name => "Kiosk"},
															{:name => "Bauernhofladen"}])