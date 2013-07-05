collection @market_stalls, :root => 'marketStalls', :object_root => false

node :url do |stall|
	market_stall_url(stall)
end

attributes :name
