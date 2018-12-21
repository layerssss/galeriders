# frozen_string_literal: true

require 'open-uri'

namespace :import do
  desc 'TODO'
  task import_may: :environment do
    User.delete_all
    Team.delete_all
    Record.delete_all

    data_teams = JSON.parse(File.read(Rails.root.join('data/teams.json')))

    data_teams.each do |data_team|
      next unless data_team.fetch('published')

      team = Team.create!(
        name: data_team.fetch('name'),
        cover_url: ImageService.upload_image(
          open(data_team.fetch('cover').fetch('url')).read
        ),
        team_order: data_team.fetch('order'),
        color: data_team.fetch('color')
      )

      data_team.fetch('users').each do |data_user|
        facebookid = /facebook\|(.+)/.match(data_user.fetch('auth0UserId'))[1]

        user = User.create!(
          team: team,
          full_name: data_user.fetch('name'),
          description: data_user.fetch('description'),
          is_admin: data_user.fetch('isAdmin'),
          facebookid:  facebookid,
          picture_url: ImageService.upload_image(
            open("https://graph.facebook.com/#{facebookid}/picture?type=square").read
          )
        )

        data_user.fetch('records').each do |data_record|
          Record.create!(
            user: user,
            team: team,
            picture_url: ImageService.upload_image(
              open(data_record.fetch('file').fetch('url')).read,
              '600x600'
            ),
            hundreds: data_record.fetch('hundreds'),
            time: data_record.fetch('date').to_time
          )
        end
      end
    end
  end
end
