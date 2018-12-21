# frozen_string_literal: true

class CreateRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :records do |t|
      t.string :picture_url
      t.integer :hundreds
      t.date :date
      t.integer :user_id
      t.integer :team_id

      t.timestamps
    end
  end
end
