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
        { name: "description", property: 'description', content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
        { name: "twitter:card", property: 'twitter:card', content: "summary_large_image" },
        { name: "twitter:title", property: 'twitter:title', content: "College Scorecard" },
        { name: "twitter:description", property: 'twitter:description', content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
        { name: "twitter:image", property: 'twitter:image', content: `https://collegescorecard.ed.gov/social-card.png` },
        { name: "og:description", property: 'og:description', content: "Find the college that’s the best fit for you! The U.S. Department of Education’s College Scorecard has the most reliable data on college costs,graduation, and post-college earnings." },
        { name: "og:image", property: 'og:image', content: `https://collegescorecard.ed.gov/social-card.png` },
        { name: "og:type", property: 'og:type', content: "website" },
        { name: 'og:url', property: 'og:url', content: 'https://collegescorecard.ed.gov/' },
        { name: 'og:title', property: 'og:title', content: 'College Scorecard' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})