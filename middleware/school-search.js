export default defineNuxtRouteMiddleware((to, from) => {
  let query = to.query
  let params_modified = false

  if (query.state) {
    if (Array.isArray(query.state)) {
      query.state = query.state.join(',')
      params_modified = true
    }
  }

  if (query.cip4_degree) {
    if (!Array.isArray(query.cip4_degree)) {
      query.cip4_degree = query.cip4_degree.split(',')
      params_modified = true
    }
  }

  if (query.size) {
    if (!Array.isArray(query.size)) {
      query.size = query.size.split(',')
      params_modified = true
    }
  }

  if (query.control) {
    if (!Array.isArray(query.control)) {
      query.control = query.control.split(',')
      params_modified = true
    }
  }

  if (query.locale) {
    if (!Array.isArray(query.locale)) {
      query.locale = query.locale.split(',')
      params_modified = true
    }
  }

  if (params_modified) {
    console.log(query)
    return navigateTo({
      path: to.path,
      query: query
    }, { replace: true })
  }
})