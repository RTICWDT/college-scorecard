<template>
  <v-app>
    <scorecard-header />
    <router-view :is-loading="isLoading" @loading="isLoading = $event" />
    <compare-header />
    <v-bottom-sheet id="compare-modal" v-model="$store.state.drawerOpen" inset>
      <compare-drawer :show-info-text="false"></compare-drawer>
    </v-bottom-sheet>        
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

  metaInfo() {
    return {
      title: this.$static.metadata.siteName,
      meta: [
        {
          key: "description",
          name: "description",
          content: this.$static.metadata.siteDescription,
        },
      ]
    }
  },
}
</script>
