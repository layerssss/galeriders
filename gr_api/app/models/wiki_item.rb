# frozen_string_literal: true

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

class WikiItem < ApplicationRecord
  belongs_to :updated_by_user, class_name: 'User'
  has_many :revisions, class_name: 'WikiItemRevision', inverse_of: :wiki_item

  default_scope(
    lambda {
      order(updated_at: :desc)
    }
  )

  def aliases
    super.to_s.split(',').map(&:strip)
  end

  def aliases=(values)
    super(values.join(','))
  end

  def revise!(args)
    return if args.fetch(:aliases) == aliases && args.fetch(:content) == content

    update_attributes!(
      aliases: args.fetch(:aliases),
      content: args.fetch(:content),
      updated_by_user: args.fetch(:user)
    )
    revisions.create!(
      content: args.fetch(:content),
      updated_by_user: args.fetch(:user)
    )
  end
end
