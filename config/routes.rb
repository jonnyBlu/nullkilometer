Nullkilometer::Application.routes.draw do
  scope "/api", :defaults => {:format => :json} do

    resources :point_of_sales, :controller => "point_of_interests", :defaults => { :type => "PointOfSale" } do
      resources :market_stalls, :only => [:index, :create]
      resources :products, :only => :index do
        collection do
          match "category/:category", :to => "products#show", :via => :get
          match "category/:category/point_of_production/:point_of_production_id", :to => "supplies#create", :via => :post
        end
      end
      resources :supplies, :only => :index
    end

    resources :market_stalls do
      resources :products, :only => :index do
        collection do
          match "category/:category", :to => "products#show", :via => :get
          match "category/:category/point_of_production/:point_of_production_id", :to => "supplies#create", :via => :post
        end
      end
    end

    resources :products, :only => :index
 
    resources :point_of_productions, :controller => "point_of_interests", :defaults => { :type => "PointOfProduction" }

    resources :point_of_interests, :only => :index

    resources :supplies, :only => :create

    get "product_categories", :to => "products#categories"
    get "shop_types", :to => "point_of_interests#shop_types"
  end

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'home#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
