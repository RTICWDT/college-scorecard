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
            darkgrey: '#6c737c',
            navyblue: '#026aa2',
            darkblue: '#102E52',
            lightyellow: '#fffaeb',
            yellow: '#fdbf32',
            warning: '#fff3cf',
            black: '#000000',
            schoolgreen: 'rgb(131, 195, 140)',
            gray: '#999999',
          },  
          variables: {
            'medium-emphasis-opacity': 1,
            'input-control-height': '30px',
          }
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})