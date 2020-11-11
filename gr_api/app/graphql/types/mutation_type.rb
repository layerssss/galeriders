# frozen_string_literal: true

Types::MutationType = GraphQL::ObjectType.define do
  name 'Mutation'

  field :login, Types::UserType do
    argument :token, !types.String
    resolve(
      lambda { |_obj, args, _ctx|
        user = User.find_by_token args[:token]

        user
      }
    )
  end

  field :join_team, !Types::UserType do
    argument :id, !types.ID
    resolve(
      lambda { |_obj, args, ctx|
        current_user = ctx[:current_user]
        raise 'You must login first' unless current_user

        team = Team.find args[:id]
        current_user.update_attributes! team: team

        current_user
      }
    )
  end

  field :create_record, !Types::RecordType do
    argument :hundreds, !types.Int
    argument :picture_url, !types.String
    resolve(
      lambda { |_obj, args, ctx|
        current_user = ctx[:current_user]
        raise GraphQL::ExecutionError, 'You must login first' unless current_user
        raise GraphQL::ExecutionError, 'You must join a team first' unless current_user.team

        record = Record.create!(
          hundreds: args[:hundreds],
          picture_url: args[:picture_url],
          user: current_user,
          team: current_user.team,
          time: Time.now
        )

        record
      }
    )
  end

  field :update_user_description, !Types::UserType do
    argument :id, !types.ID
    argument :description, !types.String
    resolve(
      lambda { |_obj, args, ctx|
        current_user = ctx[:current_user]

        raise 'You must login first' unless current_user

        user = User.find args[:id]
        raise 'Permission denied' unless current_user.is_admin || user.id == current_user.id
        user.update_attributes! description: args[:description]

        user
      }
    )
  end

  field :update_wiki_item, !Types::WikiItemType do
    argument :title, !types.String
    argument :content, !types.String
    argument :aliases, !types.[](!types.String)
    resolve(
      lambda { |_obj, args, ctx|
        current_user = ctx[:current_user]

        raise 'You must login first' unless current_user

        wiki_item = WikiItem.find_by!(title: args[:title])

        wiki_item.revise!(
          content: args[:content],
          aliases: args[:aliases],
          user: current_user
        )

        wiki_item
      }
    )
  end
end
