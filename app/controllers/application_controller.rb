class ApplicationController < ActionController::Base
  protect_from_forgery

	rescue_from Errors::NotFoundError do |e|
		render :json => {:errors => e.message}, :status => 404
	end

	# rescue_from Errors::UnprocessableEntityError do |e|
	# 	render :json => {:errors => e.message}, :status => 422
	# end
	
end