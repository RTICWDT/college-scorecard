<template>
  <v-tabs slider-size="5" :optional="true" :value="selected">
    <div class="mb-0 px-5 d-flex align-self-center black--text light-grey">
      <strong>SEARCH:</strong>
    </div>
    <v-tab to="/search/" :class="{ current: selected == 0 }">
      Schools
    </v-tab>

    <v-tab to="/search/fos" :class="{ current: selected == 1 }">
      Fields of Study
    </v-tab>
    <v-tabs-slider height="10" :color="sliderColor" />
  </v-tabs>
</template>

<style lang="scss" scoped>
.v-tab {
  letter-spacing: normal;
  text-transform: none;
  color: #000000 !important;
}
.v-tabs-slider {
  border-radius: 5px 5px 0 0;
}
.current {
  font-weight: bold;
}
</style>

<script>
export default {
  props: {
    selected: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {}
  },
  computed: {
    sliderColor() {
      switch (this.selected) {
        case 0:
          return "#7BD88C"
          break
        case 1:
          return "#FDB022"
          break
        default:
          this.sliderColor = "#FFFFFF88"
          break
      }
    },
  },
}
</script>
