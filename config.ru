require 'vienna'

ENV['AUTH'] ||= ""
user, pass = ENV['AUTH'].split(',')
use Rack::Auth::Basic do |username, password|
  username == user and password == pass
end

run Vienna::Application.new('_site')
