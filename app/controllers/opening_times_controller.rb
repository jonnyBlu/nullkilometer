class OpeningTimesController < ApplicationController

	respond_to :json, :html

	def index
		@opening_times = OpeningTime.all
		respond_with @opening_times		
	end

	def show
		@opening_time = OpeningTime.find(params[:id])
		respond_with @opening_time
	end

	def new
		@opening_time = OpeningTime.new
		respond_with @opening_time
	end

	def create
		@opening_time = OpeningTime.new(params[:opening_time])
		@opening_time.save
		respond_with @opening_time 
	end

	def update
		@opening_time = OpeningTime.find(params[:id])
		@opening_time.update_attributes(params[:opening_time])
		respond_with @opening_time
	end

	def destroy
		@opening_time = OpeningTime.find(params[:id])
		@opening_time.destroy
		respond_with @opening_time
	end
end
