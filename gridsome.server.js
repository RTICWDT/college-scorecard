// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
module.exports = function (api) {
  const fs = require("fs");

  api.loadSource(async store => {
    const package = JSON.parse(fs.readFileSync('./package.json'));
    store.addMetadata('version', package.version);
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })

  api.  chainWebpack (config => {
    config.mode('development')
  })
}
