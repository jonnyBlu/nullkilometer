collection @products, :root => 'products', :object_root => false

node :url do |p|
	seller_product_category_url(p)
end

attributes :category => :categoryId