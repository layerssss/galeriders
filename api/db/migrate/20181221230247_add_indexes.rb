# frozen_string_literal: true

class AddIndexes < ActiveRecord::Migration[5.2]
  def change
    add_index :records, :user_id
    add_index :records, :team_id
    add_index :teams, :team_order
    add_index :users, :team_id
    add_index :wiki_item_revisions, :wiki_item_id
    add_index :wiki_item_revisions, :created_at
    add_index :wiki_items, :updated_at
  end
end
