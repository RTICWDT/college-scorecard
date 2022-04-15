<template>
  <v-app>
    <scorecard-header />
    <router-view :is-loading="isLoading" @loading="isLoading = $event" />
    <scorecard-footer />

  </v-app>
</template>

<static-query>
query {
  metadata {
    siteName
    siteDescription
  }
}
</static-query>

<script>
import "~/js/filters.js"
import "~/js/mixins.js"

import { localStorageKeys } from "~/js/constants.js"
import { LocalStorage } from "~/js/localStoage.js"

export default {
  data() {
    return {
      results: {},
      site: {
        data: {
          all: null,
          states: null,
          programs: null,
          religiousAffiliations: null,
          specializedMission: null,
        },
      },
      isLoading: true,
    }
  },
  mounted(){
    this.$store.commit("toggleDrawer", false)
    //this.$store.commit("setOutboundUrl", "")
  },    

  metaInfo() {
    return {
      title: this.$static.metadata.siteName,
      titleTemplate: '%s | College Scorecard',
      script: [
        {
          type: 'text/javascript',
          src:  this.$url('/js/picc-analytics.js'),          
        },
        {
          type: 'text/javascript',
          src:  this.$url('/js/hotjar.js'),          
        },
        {
          type: 'text/javascript',
          src:  this.$url('/js/gtag.js'),          
        }             
      ],
      meta: [
        
      ]
    }
  },
}
</script>
