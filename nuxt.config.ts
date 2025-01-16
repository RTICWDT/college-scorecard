// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const isLocalBuild = process.env.NODE_ENV === 'development'
const isDevBuild = process.env.NODE_ENV === 'production' && (process.env.DEV === 'true')

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      version: '3.5.0',
      apiKey: process.env.SCORECARD_API_KEY,
      apiUrl: process.env.SCORECARD_API_URL,
      recaptchaKey: process.env.RECAPTCHA_KEY,
      apiSignupKey: process.env.API_SIGNUP_KEY,
      isLocalBuild: isLocalBuild,
      isDevBuild: isDevBuild,
      baseURL: process.env.NUXT_BASE_URL
    }
  },

  ignore: [
    "**/*.stories.{js,cts,mts,ts,jsx,tsx}",
    "**/*.{spec,test}.{js,cts,mts,ts,jsx,tsx}",
    "**/*.d.{cts,mts,ts}",
    "**/.{pnpm-store,vercel,netlify,output,git,cache,data}",
    ".nuxt/analyze",
    ".nuxt",
    "**/-*.*",

    // Dev-only test page
    isDevBuild ? "" : "**/test.*", 
  ].filter(Boolean),

  build: {
    transpile: ['vuetify', 'leaflet', '@vue-leaflet/vue-leaflet'],
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-lodash',
    '@nuxtjs/leaflet',
    'nuxt-gtag',
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
    "~/assets/scss/_fonts.scss"
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
          additionalData: `
            @use "~/assets/scss/_breakpoints.scss" as *;
            @import "@/assets/scss/_functions.scss";
          `,
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  },

  app: {
    baseURL: process.env.BRANCH_NAME ? `/${process.env.BRANCH_NAME}/` : '/',
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 'http-equiv': "Cache-control", content: "private, no-store" },
        { name: 'HandheldFriendly', property: 'HandheldFriendly', content: 'True' },
        { name: 'MobileOptimized', property: 'MobileOptimized', content: '320' },
        { name: "google-site-verification", property: 'google-site-verification', content: "joZQgj-M8GQ05V29ojfVsbsNk44SRgGqJfws9tBcnPU" },
        { name: "google-site-verification", property: 'google-site-verification', content: "V-KEdRwSWd6GSLEWRBddZy6B5yLCs6vkRRflrImQiKE" },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://use.typekit.net/nmj8tls.css'
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png'
        }
      ],
      script: [
        { id: "_fed_an_ua_tag", src: "https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js" },
        { type: "text/javascript", src: "https://www.googletagmanager.com/gtag/js?id=UA-48605964-29", async: true },
        { type: "text/javascript", src: "https://www.googletagmanager.com/gtag/js?id=UA-48605964-29", async: true },
      ],
    },
  },
})