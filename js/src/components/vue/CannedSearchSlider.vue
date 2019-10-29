<template>
  <v-switch :label="label" 
    inset 
    color="secondary" 
    @change="$emit('canned-search-toggle', {value: $event, data: addToQuery})" 
    hide-details
    :loading="isLoading"
  >
   <simple-tooltip v-if="tip" slot='append' color="#38691F">{{tip}}</simple-tooltip>
  </v-switch>
</template>
<style lang="scss" >
  @import 'sass/_variables';
  .v-input--switch.v-input .v-label{
    color: $darker-green !important;
    font-weight: bold;
    font-family: $header-font-family;
  }
</style>
<script>
import SimpleTooltip from "components/vue/SimpleTooltip.vue";
export default {
  components:{
    'simple-tooltip': SimpleTooltip
  },
  props:{
    label: String,
    addToQuery: {
      type: Array,
      default: null
    },
    isLoading:Boolean,
    tip:{
      type: String,
      default: ''
    }
  }
}
</script>