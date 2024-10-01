import VueRecaptchaPlugin from 'vue-recaptcha'

export default defineNuxtPlugin(({ vueApp }) => {
  const {
    public: { recaptcha },
  } = useRuntimeConfig()
  vueApp.use(VueRecaptchaPlugin, recaptcha)
})