export default defineNuxtRouteMiddleware((to, from) => {
  if (to.query.cip4 && to.query.cip4_degree) {
    return
  }

  return navigateTo('/search/fos-landing')
})