<template>
  <v-btn
    rounded
    color="secondary"
    target="_blank"
    :href="$url('/school/transition/')"
    @click="transitionOutboundLink($event, fixedUrl)"
    v-if="url"
  >
    <v-icon small class="mx-1">fas fa-calculator</v-icon>
    <span class="d-none d-sm-flex">Calculate your personal net price<v-icon
                                  x-small
                                  color="white"
                                  class="pl-1 pb-1 align-self-end"
                                  style=""
                                >
                                  fas fa-external-link-alt
                                </v-icon></span>
    <span class="d-block d-sm-none">Calculate net price</span>
  </v-btn>
</template>

<script>
export default {
  props: ["url"],
  computed: {
    fixedUrl() {
      if (this.url == "#") return false
      else if (this.url.match(/^http/)) return encodeURIComponent(this.url)
      else return "http://" + encodeURIComponent(this.url)
    },
  },
}
</script>
