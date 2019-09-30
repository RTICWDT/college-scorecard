<style lang="scss">

  .nameLink{
    text-decoration: none;
    line-height: 125%;
  }
  .search-result-card{
    border: 4px solid #FFFFFF !important;
  }
  .result-card-selected{
    border: 4px solid #eeba28 !important;    
  }
</style>

<template>
  <v-card tile class="search-result-card mx-auto pa-0" 
    outlined :class="{'result-card-selected': isSelected}"> <!-- Better Selected style -->
    <v-card-text>
        <v-btn color="primary" small fab icon ripple class='float-right' :class="{amber: isSelected}" @click="$emit('toggle-compare-school',school)">
          <v-icon>fa fa-star</v-icon>
        </v-btn>
        <p class='overline font-weight-bold mb-1'>{{school['school.city']}}, {{school['school.state']}}</p>
        <h2 class="title mt-0"><a class='nameLink' :href='"/school/?"+_.get(school,"id")'>{{school['school.name'] ? school['school.name'] : 'School Name'}}</a></h2>
        <p class='subtitle-1 font-italic'>{{school['latest.student.size'] | separator }} undergrads</p>
        <v-divider />
        <v-row>
        <v-col cols='5'  class="pr-0 text-center">
          <h3>{{displayGradRate}}</h3>
        </v-col>
        <v-col cols='7'>
          <span>who go graduate <tooltip definition="graduation-rate" /></span>
        </v-col>
      </v-row>
      <v-row class='result-card-info-container'>
        <v-col cols='5' class="pr-0 text-center">
          <h3>{{displayEarn}}</h3>
        </v-col>
        <v-col cols='7'>
          <span>typical earnings for recent graduates <tooltip definition="avg-salary" /></span>          
        </v-col>
      </v-row>
      <v-row class='result-card-info-container'>
        <v-col cols='5' class="pr-0 text-center">
          <h3>{{displayAvgCost}}</h3>
        </v-col>
        <v-col cols='7'>
          <span>average annual cost after aid <tooltip definition="avg-cost-year" /></span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import numeral from 'numeral';
import Tooltip from 'components/vue/Tooltip.vue';

export default {
  components: {
    tooltip: Tooltip
  },
  props:{
      "school": Object,
      "isSelected": Boolean
  },
  computed:{
    displayGradRate(){
      if (!this.school['latest.completion.rate_suppressed.overall'] || this.school['latest.completion.rate_suppressed.overall'] < 0){
        return "N/A"
      }else{
        return Math.round(this.school['latest.completion.rate_suppressed.overall'] * 100) + '%';
      }
    },
    displayEarn(){
      // if (!this.school['latest.earnings.10_yrs_after_entry.median'] || this.school['latest.earnings.10_yrs_after_entry.median'] < 0){
      //   return "N/A"
      // }else{
      //   return numeral(this.school['latest.earnings.10_yrs_after_entry.median']).format('$0a');
      // }
      return "$12K - $42K";
    },
    displayAvgCost(){
      if (!this.school['latest.cost.avg_net_price.overall'] || this.school['latest.cost.avg_net_price.overall'] < 0){
        return "N/A"
      }else{
        return numeral(this.school['latest.cost.avg_net_price.overall']).format('$0a');
      }
    }
  }
}
</script>