module Errors
	
	class NotFoundError < StandardError; end
	class InvalidPointOfInterest < NotFoundError; end
	class InvalidPointOfSale < NotFoundError; end
	class InvalidMarketStall < NotFoundError; end
	class InvalidProduct < NotFoundError; end
	class InvalidPointOfProduction < NotFoundError; end
	class InvalidParameters < NotFoundError; end

	# class UnprocessableEntityError < StandardError; end

end