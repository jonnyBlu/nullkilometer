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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141215185742) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "admins", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "admins", ["email"], :name => "index_admins_on_email", :unique => true
  add_index "admins", ["reset_password_token"], :name => "index_admins_on_reset_password_token", :unique => true

  create_table "deliveries", force: true do |t|
    t.integer  "point_of_production_id"
    t.integer  "product_id"
    t.float    "distance"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "deliveries", ["point_of_production_id"], :name => "index_deliveries_on_point_of_production_id"
  add_index "deliveries", ["product_id"], :name => "index_deliveries_on_product_id"

  create_table "detail_infos", force: true do |t|
    t.string   "website"
    t.string   "mail"
    t.string   "phone"
    t.string   "cell_phone"
    t.text     "description"
    t.integer  "detailable_id"
    t.string   "detailable_type"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "market_stalls", force: true do |t|
    t.string   "name"
    t.integer  "point_of_sale_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.integer  "status_id"
  end

  add_index "market_stalls", ["point_of_sale_id"], :name => "index_market_stalls_on_point_of_sale_id"

  create_table "opening_times", force: true do |t|
    t.integer  "point_of_sale_id"
    t.integer  "day"
    t.string   "from"
    t.string   "to"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  add_index "opening_times", ["point_of_sale_id"], :name => "index_opening_times_on_point_of_sale_id"

  create_table "place_features", force: true do |t|
    t.string "name"
  end

  create_table "place_features_point_of_interests", id: false, force: true do |t|
    t.integer "place_feature_id"
    t.integer "point_of_interest_id"
  end

  create_table "point_of_interests", force: true do |t|
    t.string   "name"
    t.string   "address"
    t.float    "lat"
    t.float    "lon"
    t.integer  "pos_type"
    t.string   "type"
    t.integer  "status_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "products", force: true do |t|
    t.integer  "category"
    t.integer  "seller_id"
    t.string   "seller_type"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "statuses", force: true do |t|
    t.string "name"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "versions", force: true do |t|
    t.string   "item_type",      null: false
    t.integer  "item_id",        null: false
    t.string   "event",          null: false
    t.string   "whodunnit"
    t.text     "object"
    t.text     "object_changes"
    t.datetime "created_at"
  end

  add_index "versions", ["item_type", "item_id"], :name => "index_versions_on_item_type_and_item_id"

end
