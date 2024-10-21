// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { csp } from './utils/csp'

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

  app: {
    head: {
      titleTemplate: '%s | College Scorecard',
      meta: [
        csp(),
        { name: 'HandheldFriendly', content: 'True' },
        { name: 'MobileOptimized', content: '390' },
        { name: "google-site-verification", content: "joZQgj-M8GQ05V29ojfVsbsNk44SRgGqJfws9tBcnPU" },
        { name: "google-site-verification", content: "V-KEdRwSWd6GSLEWRBddZy6B5yLCs6vkRRflrImQiKE" },
        { name: "viewport", content: "width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1" },
        { 'http-equiv': "Cache-control", content: "private, no-store" },
        { name: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "og:description", content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
        { name: "twitter:description", content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
        { name: "description", content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
        { name: "og:image", content: "https://collegescorecard.ed.gov/img/CollegeScorecard-Blog-Image-updated.png" },
        { name: "twitter:image", content: "https://collegescorecard.ed.gov/img/CollegeScorecard-Blog-Image-updated.png" },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://use.typekit.net/nmj8tls.css'
        }
      ],
      script: [
        { id: "_fed_an_ua_tag", src: "https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js" },
        { type: "text/javascript", src: "https://www.googletagmanager.com/gtag/js?id=UA-48605964-29", async: true },
        { type: "text/javascript", src: "https://www.googletagmanager.com/gtag/js?id=UA-48605964-29", async: true },
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