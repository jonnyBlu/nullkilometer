collection @products, :root => 'products', :object_root => false

# node :links do |p|
# 	{:self => seller_product_category_path(p)}
# end
node :self do |p|
	seller_product_category_path(p)
end

attributes :category => :categoryId