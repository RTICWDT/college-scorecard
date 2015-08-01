var extend = require('extend');

var LAUNCH_URL = (
  process.env.LAUNCH_URL ||
  'http://localhost:4000/college-choice/'
);

var browsers = {
  chrome: {browserName: 'chrome'},
  firefox: {browserName: 'firefox'},
  ie9: {
    browserName: 'internet explorer',
    version: '9.0',
    platform: 'Windows 7'
  },
  ie8: {
    browserName: 'internet explorer',
    version: '8.0',
    platform: 'Windows XP'
  },
  phantomjs: {
    browserName: 'phantomjs'
  }
};

var capabilities = extend({
  javascriptEnabled: true,
  acceptSslCerts: false
}, browsers.phantomjs);

var sauce = {
  selenium_host: "ondemand.saucelabs.com",
  selenium_port: 80,
  username: process.env.SAUCE_USERNAME,
  access_key: process.env.SAUCE_ACCESS_KEY,
  use_ssl: false,
  silent: true,
  output: true,
  screenshots: {
    enabled: false,
    on_failure: false
  },
  globals: {
    env: "sauce"
  },
  desiredCapabilities: browsers.chrome,
  selenium: {
    start_process: false
  }
};

var environments = {
  'default': {
    launch_url: LAUNCH_URL,
    selenium_host: "127.0.0.1",
    selenium_port: 4444,
    silent: true,
    disable_colors: false,
    screenshots: {
      enabled: true,
      on_failure: true,
      path: 'test/screenshots'
    },
    desiredCapabilities: capabilities,
    globals: {
      env: "default"
    }
  },

  sauce: sauce
};

for (var browser in browsers) {
  environments[browser] = extend({}, sauce, {
    desiredCapabilities: extend({}, capabilities, browsers[browser])
  });
}

module.exports = {
  src_folders: [
    "./test/functional"
  ],

  page_objects_path: './test/pages',

  // run multiple tests in parallel
  test_workers: false,

  live_output: false,
  output_folder: '/tmp',
  parallel_process_delay: 10,

  custom_assertions_path: '',
  globals_path: './test/globals.js',

  selenium: {
    start_process: false,
    server_path: '',
    log_path: '',
    host: "127.0.0.1",
    port: 4444,
    cli_args: {
      "webdriver.chrome.driver": '',
      "webdriver.ie.driver": '',
      "webdriver.firefox.profile": ''
    }
  },

  test_settings: environments
};
