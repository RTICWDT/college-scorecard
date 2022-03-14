// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'College Scorecard',
  plugins: [],
  pathPrefix: process.env.BASEURL || '/', //use for federalist
  chainWebpack (config) {
    config.mode('development')
  }, 
  siteDescription: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs, graduation, and post-college earnings."
}
