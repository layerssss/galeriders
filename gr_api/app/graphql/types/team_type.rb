# frozen_string_literal: true

Types::TeamType = GraphQL::ObjectType.define do
  name 'Team'
  field :id, !types.ID
  field :name, !types.String
  field :cover_url, !types.String
  field :color, !types.String
  field :users, types.[](!Types::UserType)

  field :day_total_hundreds, !types.Int do
    argument :day, types.String, default_value: Time.now
    resolve(
      lambda { |obj, args, _ctx|
        obj.records.day(args[:day]).sum(:hundreds)
      }
    )
  end

  field :month_total_hundreds, !types.Int do
    resolve(
      lambda { |obj, _args, _ctx|
        obj.records.month.sum(:hundreds)
      }
    )
  end

  field :week_hundreds, types.[](!types.Int) do
    resolve(
      lambda { |obj, _args, _ctx|
        Week.weeks.map do |week|
          obj.records.week(week.start_day).sum(:hundreds)
        end
      }
    )
  end

  field :day_records, types.[](!Types::RecordType) do
    argument :day, types.String, default_value: Time.now
    resolve(
      lambda { |obj, args, _ctx|
        obj.records.day(args[:day])
      }
    )
  end

  field :month_records, types.[](!Types::RecordType) do
    resolve(
      lambda { |obj, _args, _ctx|
        obj.records.month
      }
    )
  end
end
