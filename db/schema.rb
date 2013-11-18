# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20131108155314) do

  create_table "active_admin_comments", :force => true do |t|
    t.string   "namespace"
    t.text     "body"
    t.string   "resource_id",   :null => false
    t.string   "resource_type", :null => false
    t.integer  "author_id"
    t.string   "author_type"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "admin_users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0,  :null => false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
  end

  create_table "deliveries", :force => true do |t|
    t.integer  "point_of_production_id"
    t.integer  "product_id"
    t.float    "distance"
    t.datetime "created_at",             :null => false
    t.datetime "updated_at",             :null => false
  end

  create_table "detail_infos", :force => true do |t|
    t.string   "website"
    t.string   "mail"
    t.string   "phone"
    t.text     "description"
    t.integer  "detailable_id"
    t.string   "detailable_type"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  create_table "market_stalls", :force => true do |t|
    t.string   "name"
    t.integer  "market_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "opening_times", :force => true do |t|
    t.integer  "point_of_sale_id"
    t.integer  "day"
    t.string   "from"
    t.string   "to"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "point_of_interests", :force => true do |t|
    t.string   "name"
    t.string   "address"
    t.spatial  "location",   :limit => {:srid=>4326, :type=>"point", :geographic=>true}
    t.integer  "pos_type"
    t.string   "type"
    t.datetime "created_at",                                                             :null => false
    t.datetime "updated_at",                                                             :null => false
  end

  create_table "products", :force => true do |t|
    t.integer  "category"
    t.integer  "seller_id"
    t.string   "seller_type"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

end
