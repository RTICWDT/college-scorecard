require "rack/jekyll"

use Rack::Auth::Basic do |username, password|
  username == 'test' and password == 'test'
end

run Rack::Jekyll.new
