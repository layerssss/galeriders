# frozen_string_literal: true

class RemoveOrderFromTeams < ActiveRecord::Migration[5.2]
  def change
    remove_column :teams, :order, :integer, default: 0
  end
end
