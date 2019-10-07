<template>
  <v-switch :label="label" inset color="secondary" @change="$emit('canned-search-toggle', {value: $event, data: addToQuery})">

  </v-switch>
</template>
<style lang="scss" >
  @import 'sass/_variables';
  .v-input--selection-controls.v-input .v-label{
    color: $darker-green !important;
  }
</style>
<script>
export default {
  props:{
    label: String,
    addToQuery: {
      type: Array,
      default: null
    },
    // removeFromQuery: {
    //   type: Object,
    //   default: null
    // }
  }
}
</script>