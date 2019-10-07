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
          <v-icon >fa fa-star</v-icon>
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
          <h3 >{{displayGradRate  | numeral('0.%') }}</h3>
        </v-col>
      </v-row>
      <v-row class='result-card-info-container v-flex align-center'>
        <v-col cols='7' class='py-2'>
          <span v-if='!field_of_study'>Salary After Completing&nbsp;<tooltip definition="avg-salary" /></span>          
          <span v-else>Salary After Completing for {{field_of_study}}&nbsp;<tooltip definition="avg-salary" /></span>          
        </v-col>
        <v-col cols='5' class="pr-0 text--black py-2">
          <h3>{{displayEarn}}</h3>
        </v-col>
      </v-row>
      <v-row class='result-card-info-container v-flex align-center' v-if="!isProgramReporter">
        <v-col cols='7' class='py-2'>
          <span>Average Annual Cost&nbsp;<tooltip definition="avg-cost-year" /></span>
        </v-col>
        <v-col cols='5' class="pr-2 text--black py-0">
          <h3>{{displayAvgCost}}</h3>
        </v-col>
      </v-row>
      <v-row class='result-card-info-container' v-else>
        <v-col cols="12" class=''>
          <em>Average annual cost is not available for program reporters.</em>
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
      let programs = _.get(this.school, 'latest.programs.cip_4_digit', false);
      if(programs && programs.length==1 && this.school['latest.programs.cip_4_digit'][0]['title'])
      {
        let label  = this.school['latest.programs.cip_4_digit'][0]['title'];
        this.field_of_study = label.slice(0,-1);
        return '$NNK'
      }
      else
      {
        return "$NN-NNK";
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