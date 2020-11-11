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

ActiveRecord::Schema.define(version: 2018_12_21_230247) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "records", force: :cascade do |t|
    t.string "picture_url"
    t.integer "hundreds"
    t.integer "user_id"
    t.integer "team_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "time"
    t.index ["team_id"], name: "index_records_on_team_id"
    t.index ["user_id"], name: "index_records_on_user_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name"
    t.string "cover_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "color", default: "white"
    t.integer "team_order", default: 0
    t.index ["team_order"], name: "index_teams_on_team_order"
  end

  create_table "users", force: :cascade do |t|
    t.integer "team_id"
    t.string "facebookid"
    t.string "description"
    t.boolean "is_admin"
    t.string "picture_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "full_name"
    t.index ["team_id"], name: "index_users_on_team_id"
  end

  create_table "wiki_item_revisions", force: :cascade do |t|
    t.integer "wiki_item_id"
    t.string "content"
    t.string "updated_by_user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_wiki_item_revisions_on_created_at"
    t.index ["wiki_item_id"], name: "index_wiki_item_revisions_on_wiki_item_id"
  end

  create_table "wiki_items", force: :cascade do |t|
    t.string "title"
    t.string "content"
    t.string "aliases"
    t.string "updated_by_user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["updated_at"], name: "index_wiki_items_on_updated_at"
  end

end
