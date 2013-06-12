require 'test_helper'

class PointOfSalesControllerTest < ActionController::TestCase
  setup do
    @point_of_sale = point_of_sales(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:point_of_sales)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create point_of_sale" do
    assert_difference('PointOfSale.count') do
      post :create, point_of_sale: { address: @point_of_sale.address, latlon: @point_of_sale.latlon, name: @point_of_sale.name, opening_time: @point_of_sale.opening_time, type_of_POS: @point_of_sale.type_of_POS }
    end

    assert_redirected_to point_of_sale_path(assigns(:point_of_sale))
  end

  test "should show point_of_sale" do
    get :show, id: @point_of_sale
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @point_of_sale
    assert_response :success
  end

  test "should update point_of_sale" do
    put :update, id: @point_of_sale, point_of_sale: { address: @point_of_sale.address, latlon: @point_of_sale.latlon, name: @point_of_sale.name, opening_time: @point_of_sale.opening_time, type_of_POS: @point_of_sale.type_of_POS }
    assert_redirected_to point_of_sale_path(assigns(:point_of_sale))
  end

  test "should destroy point_of_sale" do
    assert_difference('PointOfSale.count', -1) do
      delete :destroy, id: @point_of_sale
    end

    assert_redirected_to point_of_sales_path
  end
end
