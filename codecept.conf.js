exports.config = {
  tests: './__tests/*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:4000',
      // show: true,
      waitForNavigation: [ "domcontentloaded", "networkidle0" ],
      waitForAction: 500,
      chrome:{
        // defaultViewport:{
        //   width: 1024,
        //   height: 768
        // }
      }
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'shadow-scorecard'
}