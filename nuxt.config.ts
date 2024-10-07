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
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt',
    'nuxt-lodash',
  ],

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://use.typekit.net/nmj8tls.css'
        }
      ]
    }
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