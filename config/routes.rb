Nullkilometer::Application.routes.draw do

 # ActiveAdmin.routes(self) if ( File.basename($0) == "rake" and not ARGV.nil? and not ARGV.index{ |a| a =~ /^db:\w/i }.nil? )
  
 # devise_for :admin_users, ActiveAdmin::Devise.config

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # See how all your routes lay out with "rake routes"
  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # get ':controller(/:action(/:id))(.:format)'


  scope "(:locale)", :locale => /en|de/ do
  #  scope "/", :defaults => {:format => :json} do
      resources :point_of_sales, :controller => "point_of_interests", :defaults => { :type => "PointOfSale" } do
        resources :market_stalls#, :only => [:index, :create]
        resources :products, :only => :index do
          collection do
            get "category/:category", :to => "products#show"
            post "category/:category/point_of_production/:point_of_production_id", :to => "deliveries#create"
          end
        end
        resources :deliveries, :only => :index
        member do 
          get "history"
        end
      end

      resources :market_stalls do
        resources :products, :only => :index do
          collection do
            get "category/:category", :to => "products#show"
            post "category/:category/point_of_production/:point_of_production_id", :to => "deliveries#create"
          end
        end
      end

      resources :products, :only => :index
   
      resources :point_of_productions, :controller => "point_of_interests", :defaults => { :type => "PointOfProduction" }

      resources :point_of_interests, :only => :index

      resources :deliveries, :only => :create

      get "product_categories", :to => "products#categories"
      get "pos_types", :to => "point_of_interests#pos_types"

      devise_for :admins
  end

  get '/:locale' => "home#index"

  #http://stackoverflow.com/questions/8390394/switch-language-with-url-rails-3
  scope "(:locale)", :locale => /en|de/ do
    root :to => 'home#index'

    get '/contacts' => 'home#contacts'
    get '/imprint' => 'home#imprint'    
    
    get "*stuff", :to => "home#routing_error"
  end

end

