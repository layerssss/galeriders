FROM ruby:2.7.4

RUN mkdir -p /rails
WORKDIR /rails
ADD Gemfile .
ADD Gemfile.lock .

RUN gem install bundler
RUN bundle install --without test --without development --deployment

ADD . .

ENV RAILS_ENV=production
ENV DATABASE_URL='postgres://pguser:mysecretpassword@db/grapi'
ENV RAILS_SERVE_STATIC_FILES=yes
ENV RAILS_LOG_TO_STDOUT=yes
