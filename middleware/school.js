export default defineNuxtRouteMiddleware((to, from) => {
  if (!Object.keys(to.query)[0]) {
    return
  }

  // return navigateTo('/')
})