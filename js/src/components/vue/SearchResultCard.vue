<style lang="scss">

  .nameLink{
    text-decoration: none;
    line-height: 125%;
  }
  .search-result-card{
    border: 4px solid #FFFFFF !important;
    width: 100%;
  }
  .result-card-selected{
    border: 4px solid #eeba28 !important;    
  }
</style>

<template>
  <v-card  class="search-result-card mx-auto pa-0 elevation-4" 
    outlined :class="{'result-card-selected': isSelected}"> <!-- Better Selected style -->
    <v-card-text class='pa-3'>
        <p class='mt-1 mb-2' v-if="_.get(school, fields['UNDER_INVESTIGATION'])==1">
          <v-chip
          color="error"
          label
          >
          <strong>Under ED Monitoring</strong>
          <tooltip definition="hcm2" color="#FFFFFF" class='ml-2' />
        </v-chip>
        </p>

        <v-btn color="primary" text icon class='float-right' :color="isSelected?'amber':'grey'"  @click="$emit('toggle-compare-school',school)">
          <v-icon >fa fa-plus-circle</v-icon>
        </v-btn>
        <p class='overline font-weight-bold mb-1'>{{school['school.city']}}, {{school['school.state']}}</p>
        <h2 class="title mt-0 font-weight-bold"><a class='nameLink' :href="link">{{school['school.name'] ? school['school.name'] : 'School Name'}}</a></h2>
        <p class='body-2 mt-1'>{{school['latest.student.size'] | separator }} undergrads</p>
        <v-divider />
        <v-row>
        <v-col cols="12">
          <small-school-icons :school="school" :fields="fields" size="small" />
        </v-col>
      </v-row>
      <v-divider />
        <v-row class="v-flex align-center"> 
        <v-col cols='7' class='py-2'>
          <span>Graduation Rate&nbsp;<tooltip definition="graduation-rate" /></span>
        </v-col>
        <v-col cols='5' class="pr-0 text--black py-2">
          <h3 class='navy-text'>{{displayGradRate}}</h3>
        </v-col>
      </v-row>
      <v-row class='result-card-info-container v-flex align-center'>
        <v-col cols='7' class='py-2'>
          <span>Salary After Completing&nbsp;<tooltip definition="avg-salary" /></span>          
        </v-col>
        <v-col cols='5' class="pr-0 text--black py-2">
          <h3 class='navy-text'>{{displayEarn}}</h3>
        </v-col>
      </v-row>
      <v-row class='result-card-info-container v-flex align-center' >
        <v-col cols='7' class='py-2'>
          <span v-if="!isProgramReporter">Average Annual Cost&nbsp;<tooltip definition="avg-cost-year" /></span>
          <span v-else>Average Annual Cost for Largest Program&nbsp;<tooltip definition="coming-soon" /></span>
        </v-col>
        <v-col cols='5' class="pr-2 text--black py-0">
          <h3 class='navy-text'>{{displayAvgCost}}</h3>
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
      fields: picc.fields,
      field_of_study: ''
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
      if(!OM && !G200_4 && !G200_LT4)
      {
        return 'N/A';
      }
      else if(OM){
        return this.$options.filters.numeral(OM,'0.%');
      }
      else{
        if(G200_LT4 || G200_4) return (this.years==3) ? this.$options.filters.numeral(G200_4,'0.%') : this.$options.filters.numeral(G200_LT4,'0.%');
        else return "N/A";
      }
    },
    isProgramReporter() {
      return _.get(this.school, this.fields.PROGRAM_REPORTER_OFFERED) > 0;
    },
    displayEarn(){
      let fos = _.get(this.school, 'latest.programs.cip_4_digit', false);
      if(!fos.length)
      {
        fos = [fos];
      }
      if(!fos)
      {
        return 'N/A';
      }
      let cleanEarnings = fos.filter(obj => obj.earnings.median_earnings && obj.credential.level <= 3);
      if(cleanEarnings.length===0)
      {
        return 'N/A';
      }
      let orderedEarnings = cleanEarnings.sort((a, b) =>   a.earnings.median_earnings-b.earnings.median_earnings);
      let single = (orderedEarnings.length==1 || (orderedEarnings.length==2 && orderedEarnings[0].earnings.median_earnings == orderedEarnings[1].earnings.median_earnings));
      let minMax = { min: orderedEarnings[0], max: orderedEarnings[orderedEarnings.length-1]};

      if(single)
      {
        return "$"+this.$options.filters.numeral(minMax.min.earnings.median_earnings, 'a');
      }
      else
      {
        return "$"+this.$options.filters.numeral(minMax.min.earnings.median_earnings, 'a')+"-"+this.$options.filters.numeral(minMax.max.earnings.median_earnings, 'a');
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