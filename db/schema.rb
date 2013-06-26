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

ActiveRecord::Schema.define(:version => 20130625114905) do

  create_table "opening_times", :force => true do |t|
    t.integer  "point_of_sale_id"
    t.integer  "day"
    t.string   "open_at"
    t.string   "close_at"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "point_of_sales", :force => true do |t|
    t.string   "name"
    t.string   "address"
    t.spatial  "latlon",      :limit => {:srid=>4326, :type=>"point", :geographic=>true}
    t.string   "type_of_POS"
    t.text     "description"
    t.datetime "created_at",                                                              :null => false
    t.datetime "updated_at",                                                              :null => false
  end

  create_table "product_assignments", :force => true do |t|
    t.integer  "point_of_sale_id"
    t.integer  "product_category_id"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  create_table "product_categories", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
