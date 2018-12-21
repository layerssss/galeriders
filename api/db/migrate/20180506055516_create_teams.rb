# frozen_string_literal: true

class CreateTeams < ActiveRecord::Migration[5.2]
  def change
    create_table :teams do |t|
      t.string :name
      t.string :cover_url

      t.integer :order, default: 0
      t.boolean :published, default: false

      t.timestamps
    end
  end
end
