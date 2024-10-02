import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fa } from 'vuetify/iconsets/fa'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        fa,
        mdi,
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#027A48',
            secondary: '#027A48',
            accent: '#8c9eff',
            error: '#b61d1c',
            primaryfos: '#fdb022',
            tertiary: '#ebf0f3',
            darkgrey: '#6c737c'
          }
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})