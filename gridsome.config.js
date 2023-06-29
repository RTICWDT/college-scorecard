// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'College Scorecard',
  plugins: [
  ],
  pathPrefix: process.env.BASEURL || '/', //use for federalist
  configureWebpack: {
    
  },
  chainWebpack (config) {
    config.mode('production')

    /*const vueRule = config.module.rule('vue')
    vueRule.uses.clear()

    vueRule.test('/\.vue$/')
      .use('vue-loader')
      .loader('vue-loader')

    config.module
      .rule('babel-loader')
        .test('/\.js$/')
        .use('babel-loader')
          .loader('babel-loader') 

    config.module
      .rule('css-loader')
        .test('/\.css$/')
        .use('css-loader')
          .loader('vue-style-loader')
          .loader('css-loader')         */           
  }, 
  siteDescription: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs, graduation, and post-college earnings."
}
