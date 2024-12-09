// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const isLocalBuild = process.env.NODE_ENV === 'development'
const isDevBuild = process.env.NODE_ENV === 'production' && (process.env.DEV === 'true')

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiKey: process.env.SCORECARD_API_KEY,
      apiUrl: process.env.SCORECARD_API_URL,
      recaptchaKey: process.env.RECAPTCHA_KEY,
      apiSignupKey: process.env.API_SIGNUP_KEY,
      isLocalBuild: isLocalBuild,
      isDevBuild: isDevBuild,
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
  },
})