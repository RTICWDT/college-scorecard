import _ from "lodash"
const querystring = require("querystring")

export const generateQueryString = (params) => {
  let qs = querystring.stringify(params)
  return (
    "?" +
    qs
      .replace(/^&+/, "")
      .replace(/&{2,}/g, "&")
      .replace(/%3A/g, ":")
  )
}

export const parseURLParams = (url) => {
  if (!url && process.isClient) {
    url = location.search.substr(1)
  }
  let query = querystring.parse(url)

  return query || {}
}