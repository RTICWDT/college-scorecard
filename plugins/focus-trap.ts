import { defineNuxtPlugin } from '#app'
import { FocusTrap } from 'focus-trap-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('focus-trap', FocusTrap)
})