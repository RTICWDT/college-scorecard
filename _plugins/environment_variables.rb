# Plugin to add environment variables to the `site` object in Liquid templates

module Jekyll

  class EnvironmentVariablesGenerator < Generator

    def generate(site)
      if ENV['API_BASE_URL']
        site.config['API']['baseurl'] = ENV['API_BASE_URL']
      end
      if ENV['API_KEY']
        site.config['API']['key'] = ENV['API_KEY']
      end
      # puts "API: ------------------"
      # puts site.config['API']
      # puts "------------------"
    end

  end

end
