collection @market_stalls, :root => 'marketStalls', :object_root => false

attributes :id, :name

node :self do |stall|
	market_stall_path(stall)
end
# node do :links |stall|
# 	{ :self => market_stall_path(stall)}
# end