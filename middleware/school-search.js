export default defineNuxtRouteMiddleware((to, from) => {
  if (to.query.state) {
    if (Array.isArray(to.query.state)) {
      to.query.state = to.query.state.join(',')

      return navigateTo({
        path: to.path,
        query: to.query
      }, { replace: true })
    }
  }

  // return navigateTo('/')
})