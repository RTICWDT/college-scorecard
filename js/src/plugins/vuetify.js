import Vue from 'vue'
import Vuetify from 'vuetify/lib'


Vue.use(Vuetify)

const opts = {
    iconfont: 'fa',
    theme: {
        themes: {
          light: {
            primary: '#216d09',
            secondary: '#216d09',
            accent: '#8c9eff',
            error: '#b71c1c',
          },
        }
    }
}

export default new Vuetify(opts)