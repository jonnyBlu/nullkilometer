Nullkilometer::Application.routes.draw do
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
  match "*stuff", :to => "home#routing_error"
end
