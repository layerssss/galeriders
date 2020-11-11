# frozen_string_literal: true
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

class WikiItemRevision < ApplicationRecord
  belongs_to :updated_by_user, class_name: 'User'
  default_scope(
    lambda {
      order(created_at: :desc)
    }
  )

  belongs_to :wiki_item, inverse_of: :revisions
end
