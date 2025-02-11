require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get shopping_cart" do
    get pages_shopping_cart_url
    assert_response :success
  end

  test "should get my_orders" do
    get pages_my_orders_url
    assert_response :success
  end
end
