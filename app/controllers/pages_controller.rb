class PagesController < ApplicationController
  before_action :authenticate_user!, except: [:index]
  
  def index
  end

  def shopping_cart
  end

  def my_orders
  end
end
