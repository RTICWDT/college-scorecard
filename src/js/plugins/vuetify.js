import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import "~/sass/_variables";

Vue.use(Vuetify)

const vuetify = new Vuetify({
    //iconfont: 'fa',
  theme: {
    themes: {
      light: {
            primary: $mid-blue,
            secondary: $darker-green, // was 216d09
            tertiary: 'white', // was 7fbc44
            accent: '#8c9eff',
            error: '#b61d1c',
      },
    },
    options: { cspNonce: 'dQw4w9WgXcQ' },
  },
})

export default vuetify