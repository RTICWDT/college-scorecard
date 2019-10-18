<template>
  <div>
    <div v-if="minmax && minmax.single">
      <range
        :lower="{ value: 0, label: '$0' }"
        :upper="{ value: _.get(minmax.max, variable), label: $options.filters.numeral(_.get(minmax.max, variable), '$0,0') }"
        :min="{ value: 0, label: '$0' }"
        :max="adjustedMax"
        lowertip
        :uppertip="minmax.max.title.slice(0,-1)+ ' - '+ minmax.max.credential.title"
        hideMiddle
        hideLower
      ></range>
    </div>
    <div v-else-if="minmax && minmax.min">
      <range
        :lower="{ value: _.get(minmax.min, variable), label: $options.filters.numeral(_.get(minmax.min, variable), '$0,0') }"
        :upper="{ value: _.get(minmax.max, variable), label: $options.filters.numeral(_.get(minmax.max, variable), '$0,0') }"
        :min="{ value: 0, label: '$0' }"
        :max="adjustedMax"
        :lowertip="minmax.min.title.slice(0,-1)+ ' - '+ minmax.min.credential.title"
        :uppertip="minmax.max.title.slice(0,-1)+ ' - '+ minmax.max.credential.title"
        hideMiddle
      ></range>
    </div>
    <div v-else class="data-na">
      <p>Data Not Available</p>
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
  computed:{
    adjustedMax(){
      let adjMax = this.max;
      if(this.variable=='earnings.median_earnings' && !this.single)
      {
        if(this.minmax.max.earnings.median_earnings>150000)
        {
          adjMax = { value: 300000, label: '$300,000' }
        }
      }
      return adjMax;
    }
  },
};
</script>