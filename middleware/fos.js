export default defineNuxtRouteMiddleware((to, from) => {

  console.log(to, from)
  if (from.name === "search-fos-landing") {
    if (to.query.cip4 && to.query.cip4_degree) {
      return
    }

    return navigateTo('/search/fos-landing')
  }  
})