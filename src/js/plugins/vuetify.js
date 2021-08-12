import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const vuetify = new Vuetify({
    //iconfont: 'fa',
  theme: {
    themes: {
      light: {
            primary: '#2b6091',
            secondary: '#216d09',
            accent: '#8c9eff',
            error: '#b61d1c',
      },
    },
  },
})

export default vuetify