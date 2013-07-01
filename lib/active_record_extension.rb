module ActiveRecordExtension

  extend ActiveSupport::Concern

  module ClassMethods
    def has_detail_infos
    	include Detailable
    end

    def has_product_assignments
    	include Assignable
    end
  end
end

# include the extension 
ActiveRecord::Base.send(:include, ActiveRecordExtension)