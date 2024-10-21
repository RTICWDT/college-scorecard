export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.env.DEVELOPMENT) {
    return navigateTo('/')
  }
})