FROM ruby:2.6.5-alpine
#RUN gem install bundler
#RUN apt-get update -qq && apt-get install -y nodejs
RUN apk add --update nodejs-lts nodejs-npm
RUN mkdir /myapp
WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock
RUN bundle install
COPY . /myapp
EXPOSE 4000

# Start the main process.
CMD echo jekyll serve --baseurl='' -w