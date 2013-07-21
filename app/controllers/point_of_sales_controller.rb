class PointOfSalesController < ApplicationController

  respond_to :html, :json

  def index
    if params[:lat] && params[:lon] && params[:radius]
      begin
        @point_of_sales = PointOfSale.nearby(params[:lat], params[:lon], params[:radius]).all
      rescue ActiveRecord::StatementInvalid
        raise Errors::InvalidParameters, "Coordinate values are out of range [-180 -90, 180 90]"
      end
    else
      @point_of_sales = PointOfSale.all
    end
    respond_with @point_of_sales
  end

  def show
    begin
      @point_of_sale = PointOfSale.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfSale, "Couldn't find PointOfSale with id=#{params[:id]}"
    end
    respond_with @point_of_sale
  end

  # def new
  #   params[:format] = :html
  #   @point_of_sale = PointOfSale.new

  #   @point_of_sale.market_stalls.build

  #   Product::CATEGORY_NAMES.each_index{ |i| @point_of_sale.products.build(:category => i)}

  #   [1,2,3,4,5,6,0].each{ |d| @point_of_sale.opening_times.build(:dayId => d) }

  #   respond_with @point_of_sale
  # end

  def create
    @point_of_sale = PointOfSale.new(params[:point_of_sale])
    @point_of_sale.save
    respond_with @point_of_sale
  end

  def update
    begin
      @point_of_sale = PointOfSale.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfSale, "Couldn't find PointOfSale with id=#{params[:id]}"
    end
    @point_of_sale.update_attributes(params[:point_of_sale])
    respond_with @point_of_sale
  end

  def destroy
    begin
      @point_of_sale = PointOfSale.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      raise Errors::InvalidPointOfSale, "Couldn't find PointOfSale with id=#{params[:id]}"
    end
    @point_of_sale.destroy
    respond_with @point_of_sale
  end
end
