require 'rack/ssl-enforcer'
require 'vienna'
require 'rack/rewrite'

use Rack::SslEnforcer

ENV['AUTH'] ||= ""
user, pass = ENV['AUTH'].split(',')
use Rack::Auth::Basic do |username, password|
  username == user and password == pass
end

run Vienna::Application.new('_site')

use Rack::Rewrite do
  r301 %r{^/(?i)data$}, '/data/'
end
