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
            // colors derived from stylesheet: https://xd.adobe.com/view/2e1e489a-996e-4c73-b885-629da889b966-7b4d/specs/
            // i made up the error color as it's not in the design system
            'white': '#FFFFFF',
            'black': '#000000',
            'error': '#E5484D',

            'primary-blue': '#10274E',
            'primary-aqua': '#026AA2',
            'primary-green': '#007000', // this isn't part of the stylesheet, but it's used everywhere so...
            'primary-yellow': '#FDB022',
            
            'secondary-green': '#027A48',
            'secondary-blue': '#1570EF',
            'secondary-gray': '#EAEEF5',            
            'secondary-yellow': '#FEF0C7',

            'tertiary-green': '#7BD88C',
            'tertiary-yellow': '#FFFAEB',

            'blue-900': '#10274E',
            'blue-800': '#194185',
            'blue-700': '#175CD3',
            'blue-600': '#1570EF',
            'blue-500': '#2E90FA',
            'blue-400': '#53B1FD',
            'blue-300': '#84CAFF',
            'blue-200': '#B2DDFF',
            'blue-100': '#D1E9FF',
            'blue-50': '#EFF8FF',
            'blue-25': '#F5FAFF',
        
            'aqua-900': '#0B4A6F',
            'aqua-800': '#065986',
            'aqua-700': '#026AA2',
            'aqua-600': '#0086C9',
            'aqua-500': '#0BA5EC',
            'aqua-400': '#36BFFA',
            'aqua-300': '#7CD4FD',
            'aqua-200': '#B9E6FE',
            'aqua-100': '#E0F2FE',
            'aqua-50': '#F0F9FF',
            'aqua-25': '#F5FBFF',
        
            'green-900': '#054F31',
            'green-800': '#05603A',
            'green-700': '#027A48',
            'green-600': '#17A067',
            'green-500': '#44BA89',
            'green-400': '#47CE95',
            'green-300': '#7BD88C',
            'green-200': '#A6F4C5',
            'green-100': '#D1FADF',
            'green-50': '#ECFDF3',
            'green-25': '#F6FEF9',
        
            'yellow-900': '#FDB022',
            'yellow-800': '#FEC84B',
            'yellow-700': '#FEDF89',
            'yellow-600': '#FEF0C7',
            'yellow-500': '#FFFAEB',
            'yellow-400': '#FFFCF5',

            'gray-900': '#292E34',
            'gray-800': '#484E55',
            'gray-700': '#636363',
            'gray-600': '#889099',
            'gray-500': '#A8B0BA',
            'gray-400': '#C3C9D3',
            'gray-300': '#D6DCE5',
            'gray-200': '#DFE6F0',
            'gray-100': '#EAEEF5',
            'gray-50': '#F2F5FA',
            'gray-25': '#FAFCFF',
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