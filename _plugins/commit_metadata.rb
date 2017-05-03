require 'rbconfig'

module Jekyll

  class CommitMetadata < Generator
    safe true

    def generate(site)
      raise "Git is not installed" unless git_installed?
      site.config['commit_metadata'] = site_data
    end

    def site_data
      cmd = "git rev-parse HEAD"
      result = %x{ #{cmd} }
      {"sha" => result}
    end

    def git_installed?
      null = RbConfig::CONFIG['host_os'] =~ /msdos|mswin|djgpp|mingw/ ? 'NUL' : '/dev/null'
      system "git --version >>#{null} 2>&1"
    end
  end
end