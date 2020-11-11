# frozen_string_literal: true

Types::WikiItemType = GraphQL::ObjectType.define do
  name 'WikiItem'
  field :id, !types.ID
  field :title, !types.String
  field :content, !types.String
  field :aliases, !types.[](!types.String)
  field :revisions, !types.[](!Types::WikiItemRevisionType)

  field :created_at, !Types::DateTimeType
  field :updated_at, !Types::DateTimeType
  field :updated_by_user, Types::UserType
end
