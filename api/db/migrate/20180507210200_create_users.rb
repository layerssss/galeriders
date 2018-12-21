# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.integer :team_id

      t.string :facebookid
      t.string :description
      t.boolean :is_admin
      t.string :picture_url

      t.timestamps
    end
  end
end
