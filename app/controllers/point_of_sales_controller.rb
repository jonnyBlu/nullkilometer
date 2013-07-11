class PointOfSalesController < ApplicationController

  respond_to :html, :json

  def index
    if params[:lat] && params[:lon]
      @point_of_sales = PointOfSale.nearby(params[:lat], params[:lon], params[:radius])
    else
      @point_of_sales = PointOfSale.all
    end
    respond_with @point_of_sales
  end

  def show
    @point_of_sale = PointOfSale.find(params[:id])
    respond_with @point_of_sale
  end

  def new
    params[:format] = :html
    @point_of_sale = PointOfSale.new

    @point_of_sale.market_stalls.build

    Product::CATEGORY_NAMES.each_index{ |i| @point_of_sale.products.build(:category => i)}

    [1,2,3,4,5,6,0].each{ |d| @point_of_sale.opening_times.build(:day => d) }

    respond_with @point_of_sale
  end

  def edit
    @point_of_sale = PointOfSale.find(params[:id])

    respond_with @point_of_sale
  end

  def create
    @point_of_sale = PointOfSale.new(params[:point_of_sale])

    if @point_of_sale.save
      respond_with @point_of_sale
    else
      #error massage here!!!
      respond_with @point_of_sale.errors
    end
  end

  def update
    @point_of_sale = PointOfSale.find(params[:id])

    if @point_of_sale.update_attributes(params[:point_of_sale])
      respond_with @point_of_sale
    else
      #error!!!
      respond_with @point_of_sale.errors
    end
  end

  def destroy
    @point_of_sale = PointOfSale.find(params[:id])
    @point_of_sale.destroy

    respond_with @point_of_sale
  end
end
