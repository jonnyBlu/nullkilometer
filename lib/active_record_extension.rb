module ActiveRecordExtension

  extend ActiveSupport::Concern

  module ClassMethods
    def has_detail_infos
    	include Detailable
    end

    def sells_products
    	include Seller
    end

    def is_location
    	include Location    	
    end
  end
end

# include the extension 
ActiveRecord::Base.send(:include, ActiveRecordExtension)