module Detailable
	def self.included base
		base.attr_accessible :description, :mail, :phone, :website
		base.has_one :detail_info, :as => :detailable, :autosave => true, :dependent => :destroy
		base.validate :detail_infos_must_be_valid
	  base.alias_method_chain :detail_info, :build
	  base.extend ClassMethods 
	  base.init_detail_info_attributes
	end

  def detail_info_with_build
  	detail_info_without_build || build_detail_info
  end

  module ClassMethods
  	def init_detail_info_attributes
  		detail_info_attributes = DetailInfo.content_columns.map(&:name) - ["created_at", "updated_at", "detailable_type", "detailable_id"]
  		detail_info_attributes.each do |att|
				define_method(att) do
					detail_info.send(att)
				end
				define_method("#{att}=") do |val|
					detail_info.send("#{att}=",val)
				end
			end
  	end
  end

  protected
  def detail_infos_must_be_valid
  	unless detail_info.valid?
      detail_info.errors.each do |attr, message|
        errors.add(attr, message)
      end
    end
  end
end