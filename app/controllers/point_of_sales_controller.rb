class PointOfSalesController < ApplicationController
  # GET /point_of_sales
  # GET /point_of_sales.json
  def index
    @point_of_sales = PointOfSale.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @point_of_sales }
    end
  end

  # GET /point_of_sales/1
  # GET /point_of_sales/1.json
  def show
    @point_of_sale = PointOfSale.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @point_of_sale }
    end
  end

  # GET /point_of_sales/new
  # GET /point_of_sales/new.json
  def new
    @point_of_sale = PointOfSale.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @point_of_sale }
    end
  end

  # GET /point_of_sales/1/edit
  def edit
    @point_of_sale = PointOfSale.find(params[:id])
  end

  # POST /point_of_sales
  # POST /point_of_sales.json
  def create
    @point_of_sale = PointOfSale.new(params[:point_of_sale])

    respond_to do |format|
      if @point_of_sale.save
        format.html { redirect_to @point_of_sale, notice: 'Point of sale was successfully created.' }
        format.json { render json: @point_of_sale, status: :created, location: @point_of_sale }
      else
        format.html { render action: "new" }
        format.json { render json: @point_of_sale.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /point_of_sales/1
  # PUT /point_of_sales/1.json
  def update
    @point_of_sale = PointOfSale.find(params[:id])

    respond_to do |format|
      if @point_of_sale.update_attributes(params[:point_of_sale])
        format.html { redirect_to @point_of_sale, notice: 'Point of sale was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @point_of_sale.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /point_of_sales/1
  # DELETE /point_of_sales/1.json
  def destroy
    @point_of_sale = PointOfSale.find(params[:id])
    @point_of_sale.destroy

    respond_to do |format|
      format.html { redirect_to point_of_sales_url }
      format.json { head :no_content }
    end
  end
end
