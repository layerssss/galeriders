# frozen_string_literal: true

class ApiController < ApplicationController
  def upload_picture
    raise 'You must login first!' unless current_user

    url = ImageService.upload_image(
      params.fetch(:data).read,
      '600x600'
    )

    render(
      json: {
        url: url
      }
    )
  end
end
