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
      if ENV['API_SIGNUP_KEY']
        site.config['API']['signup_key'] = ENV['API_SIGNUP_KEY']
      end
      if ENV['RECAPTCHA_SITE_KEY']
        site.config['recaptcha-site-key'] = ENV['RECAPTCHA_SITE_KEY']
      end
      # puts "API: ------------------"
      # puts site.config['API']
      # puts "------------------"
    end

  end

end
