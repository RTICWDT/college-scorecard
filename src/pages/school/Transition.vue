<template>
  <v-main>
    <div class="home-splash">
      <v-container class="pt-0">
        <v-row>
          <v-col cols="12">
            <h1 class="white--text text-uppercase text-center">
              You are leaving the College Scorecard
            </h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="8" offset-sm="2">
            <v-card class="pa-5">
              <p>
                The U.S. Department of Education does not necessarily endorse the views expressed or the data and facts presented on this external site.
              </p>
              <p>
                Links are provided by the institutions and are only updated about once a year. As such, over the course of the year, some links may break or websites may be taken offline.
              </p>        
              <div class="d-flex justify-center">
                <v-btn class="mb-1 mr-2 transition-button" color="secondary" :href="url" v-if="url"
                  >Continue to Website</v-btn
                >
                <span v-else class="mb-1 mr-2"
                  ><v-icon small>fas fa-exclamation-triangle</v-icon> Invalid
                  URL</span
                >
                <v-btn class="mb-1 transition-button" @click="close" 
                  >Return to Previous Page</v-btn
                >
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-main>
</template>
<style lang="scss" scoped>
.home-splash {
  padding-top: 2.5rem;
}
</style>
<script>
const querystring = require("querystring")
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      query: {},
      outboundUrl: ""
    }
  },
  computed: {
    url() {
      let url = this.outboundUrl;
      if (
        url.match(
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        ))
     {
        return url
      } else {
        return false
      }
    },
  },
  methods: {
    close() {
      window.close();
    },
  },
  created() {
    
  },
  mounted() {
    if (true) {
      let query = querystring.parse(window.location.search.substring(1))
      this.query = query || {}
    }
  this.outboundUrl = this.$store.state.outboundUrl

  this.$store.commit("toggleDrawer", false);
  this.$store.commit("setOutboundUrl", this.outboundUrl);
  },
}
</script>
