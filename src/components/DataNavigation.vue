<template>
  <div>
    <div class="data-navigation">
      <v-tabs
        hide-slider
        background-color="grey lighten-3"
        v-model="dataTabs"
        show-arrows
        class="ml-10"
      >
        <v-tab href="/data/" value="home">Data Home</v-tab>
        <v-tab href="/data/documentation/" value="documentation"
          >Documentation</v-tab
        >
        <v-tab href="/data/changelog/" value="changelog">Change Log</v-tab>
        <v-tab href="/data/glossary/" value="glossary">Glossary</v-tab>
      </v-tabs>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "~/sass/_variables";
.data-navigation {
  background-color: $lighter-gray;
}
.v-tab--active {
  background-color: $darker-green !important;
  color: $white !important;
}
.v-tabs-bar a {
  letter-spacing: 0 !important;
  font-family: $header-font-family !important;
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
