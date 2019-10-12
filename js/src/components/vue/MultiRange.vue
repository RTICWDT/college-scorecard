<template>
  <div>
    <div v-if="minmax.single">
      <range
        :lower="{ value: 0, label: '$0' }"
        :upper="{ value: _.get(minmax.max, variable), label: $options.filters.numeral(_.get(minmax.max, variable), '$0,0') }"
        :min="{ value: 0, label: '$0' }"
        :max="max"
        lowertip
        :uppertip="minmax.max.title.slice(0,-1)+ ' - '+ minmax.max.credential.title"
        hideMiddle
        hideLower
      ></range>
    </div>
    <div v-else-if="minmax.min">
      <range
        :lower="{ value: _.get(minmax.min, variable), label: $options.filters.numeral(_.get(minmax.min, variable), '$0,0') }"
        :upper="{ value: _.get(minmax.max, variable), label: $options.filters.numeral(_.get(minmax.max, variable), '$0,0') }"
        :min="{ value: 0, label: '$0' }"
        :max="max"
        :lowertip="minmax.min.title.slice(0,-1)+ ' - '+ minmax.min.credential.title"
        :uppertip="minmax.max.title.slice(0,-1)+ ' - '+ minmax.max.credential.title"
        hideMiddle
      ></range>
    </div>
    <div v-else class="data-na">
      <p>Data not available.</p>
    </div>
  </div>
</template>

<script>
import Range from "components/vue/Range.vue";
export default {
  components: {
    range: Range
  },
  props: {
    minmax: {
      type: Object
    },
    variable: {
        type: String
    },
    max:{
        type: Object,
        default: { value: 150000, label: '$150,000' }
    }
  },
  mounted(){
      // if(this.minmax.max.earnings.median_earnings>150000)
      // {
      //     this.max = { value: 250000, label: '$250,000' }
      // }
  }
};
</script>