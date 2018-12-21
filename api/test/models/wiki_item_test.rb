# == Schema Information
#
# Table name: wiki_items
#
#  id                 :bigint(8)        not null, primary key
#  title              :string
#  content            :string
#  aliases            :string
#  updated_by_user_id :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

require 'test_helper'

class WikiItemTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
