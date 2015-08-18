# Plugin to add environment variables to the `site` object in Liquid templates

module Jekyll

  class EnvironmentVariablesGenerator < Generator

    def generate(site)
      if ENV['API_BASE_URL']
        site.config['api']['baseurl'] = ENV['API_BASE_URL']
      end
      if ENV['API_KEY']
        site.config['api']['key'] = ENV['API_KEY']
      end
      puts "------------------"
      puts "API: #{site.config['api']}"
      puts "------------------"
    end

  end

end
