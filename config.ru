require 'rack/ssl-enforcer'
require 'vienna'

use Rack::SslEnforcer

ENV['AUTH'] ||= ""

unless ENV['AUTH'].empty?
  user, pass = ENV['AUTH'].split(',')
  use Rack::Auth::Basic do |username, password|
    username == user and password == pass
  end
end

run Vienna::Application.new('_site')
