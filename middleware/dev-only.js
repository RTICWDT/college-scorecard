export default defineNuxtRouteMiddleware((to, from) => {
  if (process.env.NODE_ENV !== 'development') {
    return navigateTo('/')
  }
})