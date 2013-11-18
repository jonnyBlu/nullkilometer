Nullkilometer::Application.routes.draw do

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  # get "profile_page/new"

  # get "profile_page/create"

  # The priority is based upon order of creation:
  # first created -> highest priority.

  scope "/api", :defaults => {:format => :json} do

    resources :point_of_sales, :controller => "point_of_interests", :defaults => { :type => "PointOfSale" } do
      resources :market_stalls, :only => [:index, :create]
      resources :products, :only => :index do
        collection do
          match "category/:category", :to => "products#show", :via => :get
          match "category/:category/point_of_production/:point_of_production_id", :to => "deliveries#create", :via => :post
        end
      end
      resources :deliveries, :only => :index
    end

    resources :market_stalls do
      resources :products, :only => :index do
        collection do
          match "category/:category", :to => "products#show", :via => :get
          match "category/:category/point_of_production/:point_of_production_id", :to => "deliveries#create", :via => :post
        end
      end
    end

    resources :products, :only => :index
 
    resources :point_of_productions, :controller => "point_of_interests", :defaults => { :type => "PointOfProduction" }

    resources :point_of_interests, :only => :index

    resources :deliveries, :only => :create

    get "product_categories", :to => "products#categories"
    get "pos_types", :to => "point_of_interests#pos_types"
  end

  root :to => 'home#index'
  match '/map' => 'home#map'
  match '/addShop' => 'add_apos#index'
  match '/profilePage' => 'profile_page#index'
  match '/profilePage/edit' => 'profile_page#edit'
  match '/addProductionPlaces' => 'add_production_places#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
  match "*stuff", :to => "home#routing_error"

end
