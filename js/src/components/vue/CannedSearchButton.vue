<template>
  <button class="btn" @click="$emit('canned-search-click',{add:addToQuery,remove:removeFromQuery})">
    <slot>
      Test
    </slot>
  </button>
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