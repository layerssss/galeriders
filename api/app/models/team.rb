# frozen_string_literal: true

# == Schema Information
#
# Table name: teams
#
#  id         :bigint(8)        not null, primary key
#  name       :string
#  cover_url  :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  color      :string           default("white")
#  team_order :integer          default(0)
#

class Team < ApplicationRecord
  has_many :records, inverse_of: :team
  has_many :users, inverse_of: :team
  
  default_scope(
    lambda {
      order(:team_order)
    }
  )

  validates_presence_of :name, :cover_url, :color, :team_order
  validates_uniqueness_of :name, :cover_url, :color, :team_order
end
