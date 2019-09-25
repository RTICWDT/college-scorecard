<style lang="scss">

  .nameLink{
    text-decoration: none;
    line-height: 125%;
  }

  .result-card-selected{
    border: 2px solid rgba(255, 193, 7, 0.4) !important;    
  }
</style>

<template>
  <v-card tile class="search-result-card mx-auto pa-2" 
    outlined :class="{'result-card-selected': isSelected}"> <!-- Better Selected style -->
    <v-card-text>
       <v-btn color="primary" fab icon ripple class='float-right' :class="{amber: isSelected}" @click="$emit('toggle-compare-school',school)">
          <v-icon>fa fa-star</v-icon>
        </v-btn>
        <p class='overline font-weight-bold mb-1'>{{school['school.city']}}, {{school['school.state']}}</p>
        <h2 class="title mt-0"><a class='nameLink' :href='"/school/?"+_.get(school,"id")'>{{school['school.name'] ? school['school.name'] : 'School Name'}}</a></h2>
        <p class='subtitle-1 font-italic'>{{school['latest.student.size'] | separator }} undergrads</p>
        <v-divider />
        <v-row>
        <v-col cols='4'  class="pr-0 text-center">
          <h3>{{displayGradRate}}</h3>
        </v-col>
        <v-col cols='8'>
          <span>who go Graduate</span>
          <span class="tooltip-target u-new_line">
            <i class="fa fa-info-circle"></i>
          </span>
        </v-col>
      </v-row>
      <v-row class='result-card-info-container'>
        <v-col cols='4' class="pr-0 text-center">
          <h3>{{displayEarn}}</h3>
        </v-col>
        <v-col cols='8'>
          <span>recent graduates typically earn</span>
          <span class="tooltip-target u-new_line">
            <i class="fa fa-info-circle"></i>
          </span>
        </v-col>
      </v-row>
      <v-row class='result-card-info-container'>
        <v-col cols='4' class="pr-0 text-center">
          <h3>{{displayAvgCost}}</h3>
        </v-col>
        <v-col cols='8'>
          <span>student's average annual cost</span>
          <span class="tooltip-target u-new_line">
            <i class="fa fa-info-circle"></i>
          </span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import numeral from 'numeral';

export default {
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
      if (!this.school['latest.earnings.10_yrs_after_entry.median'] || this.school['latest.earnings.10_yrs_after_entry.median'] < 0){
        return "N/A"
      }else{
        return numeral(this.school['latest.earnings.10_yrs_after_entry.median']).format('$0a');
      }
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