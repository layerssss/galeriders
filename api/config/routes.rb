# frozen_string_literal: true

Rails.application.routes.draw do
  post '/graphql', to: 'graphql#execute'
  post '/api/upload_picture', to: 'api#upload_picture'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
