<template>
  <v-switch :label="label" color="secondary" @change="$emit('canned-search-toggle', {value: $event, data: addToQuery})">

  </v-switch>
</template>

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