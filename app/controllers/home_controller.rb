class HomeController < ApplicationController

	def routing_error
		render :json => {:errors => "no route matches"}, :status => 404
	end
end