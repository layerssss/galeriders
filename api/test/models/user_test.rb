# frozen_string_literal: true
# == Schema Information
#
# Table name: users
#
#  id          :bigint(8)        not null, primary key
#  team_id     :integer
#  facebookid  :string
#  description :string
#  is_admin    :boolean
#  picture_url :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  full_name   :string
#

require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
