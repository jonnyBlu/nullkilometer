Geocoder.configure(

 

  # geocoding service (see below for supported options):

  #NOMINATIUM
  :lookup => :nominatim,
  :http_headers => { "User-Agent" => "nullkilometer@gmail.com" },

  #MAPQUEST
  #:lookup => :mapquest,
  #:mapquest => {:licensed => true, :api_key => "Fmjtd%7Cluur206820%2Cr0%3Do5-9atw96"},
  #:http_headers => { "Referer" => "http://beta.nullkilometer.org" },

  #YANDEX
  #:lookup => :yandex,

  # IP address geocoding service (see below for supported options):
  #:ip_lookup => :maxmind,


 

  # to use an API key:
  #:api_key => "...",

  # geocoding service request timeout, in seconds (default 3):
  :timeout => 5,

  # set default units to kilometers:
  :units => :km,

  # caching (see below for details):
  #:cache => Redis.new,
  #:cache_prefix => "..."

)