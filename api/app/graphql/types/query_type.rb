# frozen_string_literal: true

Types::QueryType = GraphQL::ObjectType.define do
  name 'Query'
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :current_user do
    description 'current user'
    type Types::UserType
    resolve(
      lambda { |_obj, _args, ctx|
        ctx[:current_user]
      }
    )
  end

  field :weeks do
    type types.[](!Types::WeekType)
    resolve(
      lambda { |_obj, _args, _ctx|
        Week.weeks
      }
    )
  end

  field :month do
    type !Types::DateTimeType
    resolve(
      lambda { |_obj, _args, _ctx|
        MONTH
      }
    )
  end

  field :user do
    type !Types::UserType
    argument :id, !types.ID
    resolve(
      lambda { |_obj, args, _ctx|
        User.find(args[:id])
      }
    )
  end

  field :team do
    argument :id, !types.ID
    type !Types::TeamType
    resolve(
      lambda { |_obj, args, _ctx|
        Team.find(args[:id])
      }
    )
  end

  field :record do
    argument :id, !types.ID
    type !Types::RecordType
    resolve(
      lambda { |_obj, args, _ctx|
        Record.find(args[:id])
      }
    )
  end

  field :all_users do
    type types.[](!Types::UserType)
    resolve(
      lambda { |_obj, _args, _ctx|
        User.all
      }
    )
  end

  field :all_teams do
    description 'all teams'
    type types.[](!Types::TeamType)
    resolve(
      lambda { |_obj, _args, _ctx|
        Team.all
      }
    )
  end

  field :wiki_item do
    type !Types::WikiItemType
    argument :id, !types.ID
    resolve(
      lambda { |_obj, args, _ctx|
        WikiItem.find(args.id)
      }
    )
  end

  field :all_wiki_items do
    description 'all teams'
    type types.[](!Types::WikiItemType)
    resolve(
      lambda { |_obj, _args, _ctx|
        WikiItem.all
      }
    )
  end

  field :all_day_records do
    type types.[](!Types::RecordType)
    argument :day, types.String, default_value: Time.now
    resolve(
      lambda { |_obj, args, _ctx|
        Record.day(args[:day])
      }
    )
  end
end
