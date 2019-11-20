<template>
  <v-btn rounded color='secondary' @click="$emit('canned-search-click',{add:addToQuery,remove:removeFromQuery})">
    <slot>
      Test
    </slot>
  </v-btn>
</template>

<script>
export default {
  props:{
    addToQuery: {
      type: Array,
      default: null
    },
    removeFromQuery: {
      type: Object,
      default: null
    }
  }
}
</script>