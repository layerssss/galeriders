# frozen_string_literal: true
# == Schema Information
#
# Table name: records
#
#  id          :bigint(8)        not null, primary key
#  picture_url :string
#  hundreds    :integer
#  user_id     :integer
#  team_id     :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  time        :datetime
#

require 'test_helper'

class RecordTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
