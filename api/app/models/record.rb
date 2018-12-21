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

class Record < ApplicationRecord
  belongs_to :team, inverse_of: :records
  belongs_to :user, inverse_of: :records

  default_scope(
    lambda {
      order(time: :desc)
    }
  )

  scope(
    :month,
    lambda {
      where(
        time: MONTH.beginning_of_month..MONTH.end_of_month
      )
    }
  )

  scope(
    :week,
    lambda { |week|
      month.where(
        time: week.beginning_of_week..week.end_of_week
      )
    }
  )

  scope(
    :day,
    lambda { |day|
      month.where(
        time: day.beginning_of_day..day.end_of_day
      )
    }
  )

  validates_presence_of :picture_url, :hundreds, :user, :team, :time
end
