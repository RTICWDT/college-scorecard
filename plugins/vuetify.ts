import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi'
import { aliases as faAliases, fa } from 'vuetify/iconsets/fa'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases: {
        ...mdiAliases,
        ...faAliases,
      },
      sets: {
        mdi,
        fa,
      },
    },
    display: {
      mobileBreakpoint: 'sm',
      thresholds: {
        xs: 0,
        sm: 340,
        md: 540,
        lg: 800,
        xl: 1280,
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