<template>
  <div>
    <div v-if="minmax && minmax.single">
      <range
        :lower="{ value: 0, label: '$0' }"
        :upper="this._upper"
        :min="{ value: 0, label: '$0' }"
        :max="max"
        :upperTipStyleOverride="upperTipStyleOverride"
        lowertip
        :uppertip="minmax.max.title.slice(0,-1)+ ' - '+ minmax.max.credential.title"
        hideMiddle
        hideLower
        :addExtraPadding="addExtraPadding"
        :rangeChartStyle="rangeChartStyle"
      ></range>
    </div>
    <div v-else-if="minmax && minmax.min">
      <range
        :lower="this._lower"
        :upper="this._upper"
        :lowerTipStyleOverride="lowerTipStyleOverride"
        :upperTipStyleOverride="upperTipStyleOverride"
        :min="{ value: 0, label: '$0' }"
        :max="max"
        :lowertip="minmax.min.title.slice(0,-1)+ ' - '+ minmax.min.credential.title"
        :uppertip="minmax.max.title.slice(0,-1)+ ' - '+ minmax.max.credential.title"
        hideMiddle
        :addExtraPadding="addExtraPadding"
        :rangeChartStyle="rangeChartStyle"
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
    },
    // min:{
    //   type: Object,
    //   default: { value: 0, label: '$0' }
    // },
    // lower:{
    //   type: Object,
    //
    // },
    addExtraPadding:{
      type: Boolean,
      default: true
    },
    rangeChartStyle:{
      type: Object,
      default: ()=>{
        return {
          height: "15px"
        }
      }
    },
    lowerStyleOverride:{
      type: Object,
      default: ()=>{
        return {
          height: '22px',
          'border-left': '3px solid #0e365b'
        }
      }
    },
    lowerTipStyleOverride: {
      type: Object,
      default: ()=>{
        return {}
      }
    },
    upperStyleOverride:{
      type: Object,
      default: ()=>{
        return {
          height: '22px',
          'border-right': '3px solid #0e365b'
        }
      }
    },
    upperTipStyleOverride:{
      type: Object,
      default: ()=>{
        return {}
      }
    },

  },
  computed:{
    _lower(){
      return {
        value: _.get(this.minmax.min, this.variable),
        label: this.$options.filters.numeral(_.get(this.minmax.min, this.variable), '$0,0'),
        styles: this.lowerStyleOverride
      }
    },
    _upper(){
      return {
        value: _.get(this.minmax.max, this.variable),
        label: this.$options.filters.numeral(_.get(this.minmax.max, this.variable), '$0,0'),
        styles: this.upperStyleOverride
      }
    }
  }
};
</script>