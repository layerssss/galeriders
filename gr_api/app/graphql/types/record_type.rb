# frozen_string_literal: true

Types::RecordType = GraphQL::ObjectType.define do
  name 'Record'
  field :id, !types.ID
  field :picture_url, !types.String
  field :hundreds, !types.Int
  field :time, !Types::DateTimeType
  field :user, !Types::UserType
  field :team, !Types::TeamType
end
