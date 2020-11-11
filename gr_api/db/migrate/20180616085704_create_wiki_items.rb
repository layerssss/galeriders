class CreateWikiItems < ActiveRecord::Migration[5.2]
  def change
    create_table :wiki_items do |t|
      t.string :title
      t.string :content
      t.string :aliases
      t.string :updated_by_user_id

      t.timestamps
    end
  end
end
