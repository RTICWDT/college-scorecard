import Vue from 'vue'
import Vuetify from 'vuetify/lib'
@import "~/sass/_variables.scss";

Vue.use(Vuetify)

const vuetify = new Vuetify({
    //iconfont: 'fa',
  theme: {
    themes: {
      light: {
            primary: $mid-blue,
            secondary: $darker-green, // was 216d09
            accent: '#8c9eff',
            error: '#b61d1c',
      },
    },
  },
})

export default vuetify