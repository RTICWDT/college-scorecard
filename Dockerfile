FROM ruby:2.6.5-alpine

RUN apk add --update g++ gcc make musl-dev git

RUN mkdir /myapp
WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock
RUN bundle install

COPY . /myapp
EXPOSE 4000

CMD ["jekyll", "serve", "--host", "0.0.0.0", "--baseurl", "''", "-w", "--trace"]