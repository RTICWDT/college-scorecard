<template>
  <div class="d-print-none">
    <div class="data-navigation">
      <v-container class="py-0 pl-5">
        <v-tabs
          hide-slider
          background-color="white"
          v-model="dataTabs"
          show-arrows
        >
          <v-tab class="data-tab" :href="$url('/data/')" value="home">Data Home</v-tab>
          <v-tab class="data-tab" :href="$url('/data/documentation/')" value="documentation"
            >Documentation</v-tab
          >
          <v-tab class="data-tab" :href="$url('/data/changelog/')" value="changelog"
            >Change Log</v-tab
          >
          <v-tab class="data-tab" :href="$url('/data/glossary/')" value="glossary"
            >Glossary</v-tab
          >
        </v-tabs>
      </v-container>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "~/sass/_variables";
.data-navigation {
  background-color: $white;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.v-tabs-bar .v-tab--active {
  background-color: var(--v-primary-base)!important;
  color: $white !important;
  font-weight: bold !important;
  a {
    color: $white !important;
  }
}
a {
  letter-spacing: 0 !important;
  font-family: $header-font-family !important;
  font-weight: normal;
  font-size: 14px !important;
  color: #000 !important;
}
</style>
<script>
export default {
  props: ["current"],
  data() {
    return {
      dataTabs: this.current,
    }
  },
}
</script>
