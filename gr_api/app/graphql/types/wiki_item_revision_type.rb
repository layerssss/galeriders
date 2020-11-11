# frozen_string_literal: true

Types::WikiItemRevisionType = GraphQL::ObjectType.define do
  name 'WikiItemRevision'
  field :id, !types.ID
  field :content, !types.String
  field :created_at, !Types::DateTimeType
  field :updated_by_user, Types::UserType
end
