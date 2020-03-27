module Jekyll

  class AnalyticsGenerator < Generator

    def generate(site)

      puts "Adding google auth string"

      if ENV['ANALYTICS_STRING']
        site.config['analytics-string'] = ENV['ANALYTICS_STRING']
      end

      File.write("analytics.txt", site.config['analytics-string'])
      site.static_files << Jekyll::StaticFile.new(site, site.source, "/" , "analytics.txt")
      
    end
  
  end

end