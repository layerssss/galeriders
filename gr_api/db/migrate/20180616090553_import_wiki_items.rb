# frozen_string_literal: true

class ImportWikiItems < ActiveRecord::Migration[5.2]
  def up
    michael = User.find_by!(full_name: 'Michael Yin')

    JSON.parse(File.read(Rails.root.join('db/contentful_wiki_items.json'))).fetch('items').each do |item_data|
      WikiItem.create!(
        title: item_data.fetch('fields').fetch('name'),
        content: item_data.fetch('fields').fetch('content'),
        aliases: item_data.fetch('fields')['aliases'] || [],
        updated_by_user: michael,
        updated_at: item_data.fetch('sys').fetch('updatedAt'),
        created_at: item_data.fetch('sys').fetch('createdAt')
      )
    end
  end

  def down
    WikiItem.all.each(&:destroy!)
  end
end
