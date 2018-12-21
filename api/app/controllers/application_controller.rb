# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::Cookies

  def current_user
    authorization_header = request.headers['Authorization']

    return nil unless authorization_header

    token_str = authorization_header.sub('Bearer ', '')

    user = User.find_by_token token_str

    user
  end
end
