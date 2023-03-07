<template>
  <v-tabs slider-size="5" :hide-slider="true">
    <div class="mb-0 px-5 d-flex align-self-center black--text light-grey">
      <strong>SEARCH:</strong>
    </div>
    <v-tab to="/search/" class="school search-tab" :class="{ current: selected == 0 }">
      Schools
    </v-tab>

    <v-tab
      to="/search/fos-landing"
      class="fos search-tab"
      :class="{ current: selected == 1 }"
    >
      Fields of Study
    </v-tab>
  </v-tabs>
</template>

<style lang="scss" scoped>
.v-tab {
  letter-spacing: normal;
  text-transform: none;
  color: #000000 !important;
  position: relative;
  &::after {
    content: " ";
    border: 3px none white;
    bottom: 0;
    left: 0;
    width: 100%;
    position: absolute;
    border-radius: 5px 5px 0 0;
  }
}
.v-tab.school.current::after {
  border-color: #7bd88c;
  border-style: solid;
}
.v-tab.fos.current::after {
  border-color: #fdb022;
  border-style: solid;
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
}
</script>
