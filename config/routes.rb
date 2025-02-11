Rails.application.routes.draw do
  devise_for :users

  root "pages#index"

  get 'shopping_cart', to: 'pages#shopping_cart'
  get 'my_orders', to: 'pages#my_orders'

  namespace :admin do
    get 'users', to: 'admin#users'
    get 'items', to: 'admin#items'
  end

  namespace :api do
    namespace :v1 do
      resources :items
      resources :users
      resources :orders, only: [:create, :index, :show]
    end
  end

  get '*path', to: 'pages#index', via: :all
end