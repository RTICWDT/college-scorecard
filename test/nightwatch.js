var extend = require('extend');

var capabilities = {
  "browserName": "phantomjs",
  "javascriptEnabled": true,
  "acceptSslCerts": true
};

var sauce = {
  "selenium_host": "ondemand.saucelabs.com",
  "selenium_port": 80,
  "username": process.env.SAUCE_USERNAME,
  "access_key": process.env.SAUCE_ACCESS_KEY,
  "use_ssl": false,
  "silent": true,
  "output": true,
  "screenshots": {
    "enabled": false,
    "on_failure": true,
    "path": ""
  },
  "desiredCapabilities": {
    "browserName": "chrome"
  },
  "globals": {
    "env": "sauce"
  },
  "selenium": {
    "start_process": false
  }
};

module.exports = {
  "src_folders": [
    "./test/functional"
  ],

  "custom_assertions_path": "",
  "live_output": true,
  "parallel_process_delay": 10,

  "selenium": {
    "start_process": false,
    "server_path": "",
    "log_path": "",
    "host": "127.0.0.1",
    "port": 4444,
    "cli_args": {
      "webdriver.chrome.driver": "",
      "webdriver.ie.driver": "",
      "webdriver.firefox.profile": ""
    }
  },

  "test_settings": {

    "default": {
      "launch_url": "http://localhost:4000/college-choice/",
      "selenium_host": "127.0.0.1",
      "selenium_port": 4444,
      "silent": true,
      "disable_colors": false,
      "screenshots": {
        "enabled": false,
        "path": ""
      },
      "desiredCapabilities": capabilities,
      "globals": {
        "env": "default"
      }
    },

    "sauce": sauce,

    "travis": extend(sauce, {
      "desiredCapabilities": {
        "browserName": "chrome",
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER
      },
      "globals": {
        "env": "travis"
      }
    }),

    "phantomjs": {
      "desiredCapabilities": extend(capabilities, {
        "browserName": "phantomjs"
      })
    }

  }
};
