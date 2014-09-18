source 'https://rubygems.org'

gem 'rails', '3.2.16'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'pg'
gem 'rgeo'
gem 'activerecord-postgis-adapter'
gem 'geocoder'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails'
  gem 'coffee-rails'
  gem 'bootstrap-sass'
  gem "leaflet-rails"

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  # gem 'therubyracer', :platforms => :ruby

  gem 'uglifier'
end

gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'bootstrap-timepicker-rails-addon'
gem 'jquery-timepicker-rails'

gem 'simple_form'
gem 'client_side_validations'
gem 'client_side_validations-simple_form'

gem 'rabl'
gem 'oj'

gem 'paper_trail', '~> 3.0.3'
gem  'i18n-js'

#http://stackoverflow.com/questions/17881384/jquery-gets-loaded-only-on-page-refresh-in-rails-4-application
gem 'jquery-turbolinks'
gem 'turbolinks'

gem 'font-awesome-sass'

gem 'devise'

#devise intructions
#Some setup you must do manually if you haven't yet:

  #1. Ensure you have defined default url options in your environments files. Here
   #  is an example of default_url_options appropriate for a development environment
    # in config/environments/development.rb:
#
 #      config.action_mailer.default_url_options = { :host => 'localhost:3000' }
#
 #    In production, :host should be set to the actual host of your application.
#
 # 2. Ensure you have defined root_url to *something* in your config/routes.rb.
  #   For example:
#
 #      root :to => "home#index"
#
 # 3. Ensure you have flash messages in app/views/layouts/application.html.erb.
  #   For example:
#
 #      <p class="notice"><%= notice %></p>
  #     <p class="alert"><%= alert %></p>

#  4. If you are deploying on Heroku with Rails 3.2 only, you may want to set:
#
 #      config.assets.initialize_on_precompile = false
#
 #    On config/application.rb forcing your application to not access the DB
  #   or load models when precompiling your assets.

 # 5. You can copy Devise views (for customization) to your app by running:

  #     rails g devise:views
