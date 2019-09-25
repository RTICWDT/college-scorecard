<style lang="scss">
  .search-result-card{
    height: auto;

    @media (min-width: 960px) {
      height: 510px;
    }

    margin-bottom: 20px;
  }

  .result-card-top{
    span{
      display: inline-block;
      margin-top: 8px;
    }
    button:focus{
      background-color: white;
    }
  }

  .result-card-school-name{
    height: 100px;
    h2{
      font-size: 24px;
      color: black;
    }
  }

  .result-card-info-container{
    h3{
      margin:0px;
    }
    margin-bottom: 10px;

  }

  .result-card-selected{
    border: 2px solid rgba(255, 193, 7, 0.4) !important;    
  }
</style>

<template>

  <v-card class="search-result-card mx-auto" 
    outlined :class="{'result-card-selected': isSelected}"> <!-- Better Selected style -->
    <v-card-text>
      <div class="result-card-top">
        <span>{{school['school.city']}}, {{school['school.state']}}</span>
        
        <v-btn text icon large ripple class='float-right' :class="{amber: isSelected}" @click="$emit('toggle-compare-school',school)">
          <v-icon>fa fa-star</v-icon>
        </v-btn>

      </div>
    </v-card-text>

    <v-card-text>
      <div class="result-card-school-name">
        <h2><a :href='"/school/?"+_.get(school,"id")'>{{school['school.name'] ? school['school.name'] : 'School Name'}}</a></h2>
      </div>
      <span>{{school['latest.student.size']}} undergrads</span>
    </v-card-text>

    <v-card-text>
      <v-row class='result-card-info-container'>
        <v-col cols='12' md='3' class="pr-0">
          <h3>{{displayGradRate}}</h3>
        </v-col>
        <v-col cols='12' md='7' class='pl-3 pr-0'>
          <span>Who Go Graduate</span>
        </v-col>
        <v-col cols='12' md='2' class='pl-2 pr-0'>
          <span class="tooltip-target u-new_line">
            <i class="fa fa-info-circle"></i>
          </span>
        </v-col>
      </v-row>

      <v-row class='result-card-info-container'>
        <v-col cols='12' md='3' class="pr-0">
          <h3>{{displayEarn}}</h3>
        </v-col>
        <v-col cols='12' md='7' class='pl-3 pr-0'>
          <span>Recent graduates typically earn</span>
        </v-col>
        <v-col cols='12' md='2' class='pl-2 pr-0'>
          <span class="tooltip-target u-new_line">
            <i class="fa fa-info-circle"></i>
          </span>
        </v-col>
      </v-row>

      <v-row class='result-card-info-container'>
        <v-col cols='12' md='3' class="pr-0">
          <h3>{{displayAvgCost}}</h3>
        </v-col>
        <v-col cols='12' md='7' class='pl-3 pr-0'>
          <span>Students Average Annual Cost</span>
        </v-col>
        <v-col cols='12' md='2' class='pl-2 pr-0'>
          <span class="tooltip-target u-new_line">
            <i class="fa fa-info-circle"></i>
          </span>
        </v-col>
      </v-row>

    </v-card-text>

    <!-- <v-list-item three-line>
      <v-list-item-content>
        <div class="result-card-info-item d-flex align-center justify-space-around">
          <h3>87%</h3>
          <span>Who Go Graduate</span>
          <span class="tooltip-target u-new_line">
            <i class="fa fa-info-circle"></i>
          </span>
        </div>

        <div class="result-card-info-item d-flex align-center justify-space-around">
          <h3>87%</h3>
          <span>Recent graduates typically earn</span>
          <span class="tooltip-target u-new_line">
            <i class="fa fa-info-circle"></i>
          </span>
        </div>

        <div class="result-card-info-item d-flex align-center justify-space-around">
          <h3>87%</h3>
          <span>Students Average Annual Cost</span>
          <span class="tooltip-target u-new_line">
            <i class="fa fa-info-circle"></i>
          </span>
        </div>

      </v-list-item-content>
    </v-list-item> -->

  </v-card>

  <!-- <div class="school results-card">
    <span data-bind="school_container"></span>

    <div class="content-box">
      <h1>School ID: {{school.id}}</h1>
      <h3>School Name: {{school['school.name']}}</h3>

      <div class="compare-school">
        <button type="button" class="btn-floating btn waves-effect waves-light" :class="{amber: isSelected}"
            aria-label="Add to Compare" @click="$emit('toggle-compare-school',school)">

          <i class="fa fa-star tooltip-target"></i>
          <span class="sr-only">Add to Compare</span>
        </button>
      </div>
        
      <a class="link link-more" data-bind="more_link">
          View more details <i class="fa fa-chevron-right"></i>
      </a>
      
    </div>
  </div> -->
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