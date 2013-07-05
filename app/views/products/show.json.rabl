object @product

attributes :category => :categoryId

child :point_of_productions => :pointOfProductions do
	extends "point_of_productions/index"
end