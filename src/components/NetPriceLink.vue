<template>
  <v-btn
    color="secondary"
    target="_blank"
    :href="fixedUrl"
    @click="transitionOutboundLink($event)"
    v-if="url"
  >
    <v-icon small class="mx-1">fas fa-calculator</v-icon>
    <span class="d-none d-sm-flex"
      >Calculate your personal net price<v-icon
        x-small
        color="white"
        class="pl-1 pb-1 align-self-end"
        style=""
      >
        fas fa-external-link-alt
      </v-icon></span
    >
    <span class="d-block d-sm-none">Calculate net price</span>
  </v-btn>
</template>

<script>
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"
export default {
  mixins: [AnalyticsEvents],
  props: ["url"],
  computed: {
    fixedUrl() {
      if (this.url == "#") return false
      else if (this.url.match(/^http/)) return this.url
      else return "http://" + this.url
    },
  },
}
</script>
