# frozen_string_literal: true

class Week < Hashie::Mash
  def self.weeks
    days = []
    curr = MONTH.beginning_of_week
    while curr < MONTH.end_of_month
      days.push curr
      curr += 1.week
    end

    weeks = days.map.with_index do |day, day_index|
      start_day = [day.beginning_of_week, MONTH.beginning_of_month].max
      end_day = [day.end_of_week, MONTH.end_of_month].min
      Week.new(
        id: "week_#{day_index}",
        start_day: start_day,
        end_day: end_day
      )
    end

    weeks
  end
end
