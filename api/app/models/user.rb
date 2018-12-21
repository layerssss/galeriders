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

require 'open-uri'

class User < ApplicationRecord
  belongs_to :team, inverse_of: :users, optional: true
  has_many :records, inverse_of: :user, dependent: :destroy

  default_scope(
    lambda {
      order(:full_name)
    }
  )

  validates_uniqueness_of :facebookid
  validates_presence_of :facebookid, :picture_url, :full_name

  def month_total_hundreds
    records.month.sum(:hundreds)
  end

  def self.find_by_token(token_str)
    return nil unless token_str

    token = nil
    begin
      token = JWT.decode(
        token_str,
        (Rails.application.credentials.auth0.fetch(:secret) if Rails.application.credentials.auth0),
        Rails.application.credentials.auth0.present?
      )[0]
    rescue JWT::DecodeError
      return nil
    end

    facebookid = token.fetch('sub').sub('facebook|', '')

    user = User.find_by(facebookid: facebookid)
    user ||= User.create!(
      facebookid: facebookid,
      full_name: token.fetch('name'),
      picture_url: ImageService.upload_image(
        open("https://graph.facebook.com/#{facebookid}/picture?type=square").read
      )
    )

    user
  end
end
