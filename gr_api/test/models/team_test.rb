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

require 'test_helper'

class TeamTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
