# frozen_string_literal: true

class CreateWikiItemRevisions < ActiveRecord::Migration[5.2]
  def change
    create_table :wiki_item_revisions do |t|
      t.integer :wiki_item_id
      t.string :content
      t.string :updated_by_user_id

      t.timestamps
    end
  end
end
