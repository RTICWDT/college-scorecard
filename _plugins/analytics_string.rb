module Jekyll

  # Generator class used to pass an ENV value and create a file
  class AnalyticsGenerator < Generator
    @@analytics_filename = 'analytics.txt'
    
    def generate(site)

      puts 'Checking for Google analytics string...'

      if ENV['ANALYTICS_STRING']
        site.config['analytics-string'] = ENV['ANALYTICS_STRING']
      end

      if site.config['analytics-string'] === ''
        puts 'No String Detected, finishing...'
        return
      end

      if(File.exists?(@@analytics_filename))
        puts 'File detected, checking contents...'
        if(File.read(@@analytics_filename) === site.config['analytics-string'])
          puts 'File already generated, finishing...'
          return
        end
      end

      puts 'Creating analytics.txt in root and adding to static files...'
      File.write(@@analytics_filename, site.config['analytics-string'])
      site.static_files << Jekyll::StaticFile.new(site, site.source, '/', @@analytics_filename)
    end
  end
end
