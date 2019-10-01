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
        <p class='mt-1 my-2'>
          <v-chip
          v-if="_.get(school, fields['UNDER_INVESTIGATION'])==1"
          color="error"
          label
          >
          <strong>Under ED Monitoring</strong>
          <tooltip definition="hcm2" color="#FFFFFF" class='ml-2' />
        </v-chip>
        </p>

        <v-btn color="primary" small fab icon ripple class='float-right' :class="{amber: isSelected}" @click="$emit('toggle-compare-school',school)">
          <v-icon>fa fa-star</v-icon>
        </v-btn>
        <p class='overline font-weight-bold mb-1'>{{school['school.city']}}, {{school['school.state']}}</p>
        <h2 class="title mt-0 font-strong"><a class='nameLink' :href="link">{{school['school.name'] ? school['school.name'] : 'School Name'}}</a></h2>
        <p class='subtitle-1 font-italic'>{{school['latest.student.size'] | separator }} undergrads</p>
        <v-divider />
        <v-row> 
        <v-col cols='5'  class="pr-0 text-center">
          <h3>{{displayGradRate  | numeral('0.%') }}</h3>
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
      <v-row class='result-card-info-container' v-if="!isProgramReporter">
        <v-col cols='5' class="pr-0 text-center">
          <h3>{{displayAvgCost}}</h3>
        </v-col>
        <v-col cols='7'>
          <span>average annual cost after aid <tooltip definition="avg-cost-year" /></span>
        </v-col>
      </v-row>
      <v-row class='result-card-info-container' v-else>
        <v-col cols="12" class='text-center'>
          <em>Average annual cost is not available for program reporters.</em>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <small-school-icons :school="school" :fields="fields" size="small" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import numeral from 'numeral';
import Tooltip from 'components/vue/Tooltip.vue';
import SmallSchoolIcons from 'components/vue/SmallSchoolIcons.vue';
export default {
  components: {
    tooltip: Tooltip,
    'small-school-icons': SmallSchoolIcons
  },
  props:{
      "school": Object,
      "isSelected": Boolean
  },
  data(){
    return {
      fields: picc.fields
    }
  },
  computed:{
    link(){
      let id = _.get(this.school, this.fields['ID']);
      let name = _.get(this.school, this.fields['NAME'],'(unknown)');
      return '/school/?'+id+'-'+name.replace(/\W+/g, '-'); 
    },
    displayGradRate(){
      let OM = _.get(this.school, this.fields.COMPLETION_OM);
      let G200_4 = _.get(this.school, this.fields.COMPLETION_200_4);
      let G200_LT4 = _.get(this.school, this.fields.COMPLETION_200_LT4);
      if(OM){
        return OM;
      }
      else{
        if(G200_LT4 || G200_4) return (this.years==3) ? G200_4 : G200_LT4;
        else return "N/A";
      }
    },
    isProgramReporter() {
      return _.get(this.school, this.fields.PROGRAM_REPORTER_OFFERED) > 0;
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