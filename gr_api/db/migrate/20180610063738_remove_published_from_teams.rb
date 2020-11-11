# frozen_string_literal: true

class RemovePublishedFromTeams < ActiveRecord::Migration[5.2]
  def change
    remove_column :teams, :published, :boolean, default: false
  end
end
