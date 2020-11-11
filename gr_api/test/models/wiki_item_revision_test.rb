# == Schema Information
#
# Table name: wiki_item_revisions
#
#  id                 :bigint(8)        not null, primary key
#  wiki_item_id       :integer
#  content            :string
#  updated_by_user_id :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

require 'test_helper'

class WikiItemRevisionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
