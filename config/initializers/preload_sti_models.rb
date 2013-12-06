#if Rails.env.development?
 # %w[point_of_sale market shop].each do |c|
  #  require_dependency File.join("app","models","#{c}.rb")
  #end
#end