export default defineNuxtRouteMiddleware((to, from) => {
  if (process.env.NODE_ENV === 'production') {
    return navigateTo('/')
  }
})