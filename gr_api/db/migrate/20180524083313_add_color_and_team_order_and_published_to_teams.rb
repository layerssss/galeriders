# frozen_string_literal: true

class AddColorAndTeamOrderAndPublishedToTeams < ActiveRecord::Migration[5.2]
  def change
    add_column :teams, :color, :string, default: 'white'
    add_column :teams, :team_order, :int, default: 0
  end
end
