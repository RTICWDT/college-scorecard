var baseUrl = require('./__tests__/utility/url');

exports.config = {
  tests: './__tests__/e2e/*_test.js',
  output: './__tests__/output',
  helpers: {
    Puppeteer: {
      url: baseUrl || 'http://localhost:4000',
      // show: true,
      waitForNavigation: [ "domcontentloaded", "networkidle0" ],
      waitForAction: 500,
      chrome:{
        args:[
          // '--disable-permissions-api'
        ]
        // defaultViewport:{
        //   width: 1024,
        //   height: 768
        // }
      }
    },
    LocalStorage: {
      require: './localstorage_helper.js',
    },
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'shadow-scorecard'
}