// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiKey: process.env.GRIDSOME_API_KEY,
      apiUrl: process.env.GRIDSOME_API_URL,
      recaptchaKey: process.env.GRIDSOME_RECAPTCHA_KEY,
      apiSignupKey: process.env.GRIDSOME_API_SIGNUP_KEY
    }
  },

  build: {
    transpile: ['vuetify', 'leaflet', '@vue-leaflet/vue-leaflet'],
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-lodash',
    '@nuxtjs/leaflet',
    'nuxt-gtag',
      // todo: this method of loading vuetify makes nuxt angry, and causes npx nuxi commands
    // to fail. so lets swap this out with a more up-to-date method once we figure out how.
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-19BFKPWV7B',
  },

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '@fortawesome/fontawesome-free/css/fontawesome.min.css',
    '@fortawesome/fontawesome-free/css/solid.min.css',
    '@fortawesome/fontawesome-free/css/regular.min.css',
    '@/assets/scss/style.scss',
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_variables.scss" as variables;\n@use "~/assets/scss/_breakpoints.scss" as *;\n',
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  },

})