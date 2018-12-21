# frozen_string_literal: true

class GenerateWikiItemRevisions < ActiveRecord::Migration[5.2]
  def up
    WikiItem.all.each do |wiki_item|
      wiki_item.revisions.each(&:destroy!)
      wiki_item.revisions.create!(
        content: wiki_item.content,
        created_at: wiki_item.updated_at,
        updated_by_user_id: wiki_item.updated_by_user_id
      )
    end
  end
end
