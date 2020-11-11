# frozen_string_literal: true

Types::WeekType = GraphQL::ObjectType.define do
  name 'Week'
  field :id, !types.ID
  field :start_day, !Types::DateTimeType
  field :end_day, !Types::DateTimeType
end
