# frozen_string_literal: true

if Rails.application.credentials.aws
  Aws.config.update(
    region: 'ap-southeast-2',
    credentials: Aws::Credentials.new(
      Rails.application.credentials.aws.fetch(:access_key_id),
      Rails.application.credentials.aws.fetch(:secret_access_key)
    )
  )
end
