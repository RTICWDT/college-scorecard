<template>
  <div :class="classes" @click="$emit('update-highlight', 'school-'+school.id);">
    <p class="subtitle-2 pb-0 mb-0"><a :href="schoolLink">{{_.get(school, fields['NAME'])}}</a> </p>

    <horizontal-bar
      v-if="school && config.chart=='HorizontalBar' && value"
      :value="value"
      :min="0"
      :max="config.max"
      :color="config.color"
      :height="25"
      :type="config.type"
      :labels="true"
    ></horizontal-bar>
    <div v-if="school && config.chart=='HorizontalBar' && !value" class="data-na">Data Not Available</div>

    <range
      v-if="school && config.chart=='Range' && value.available"
      :lower="{value: value.lower, label: value.lower }"
      :upper="{value: value.upper, label: value.upper }"
      :min="{ value: value.min, label: value.min }"
      :max="{ value: value.max, label: value.max }"
      lowertip
      uppertip
      hideMiddle
    ></range>
    <div v-if="school && config.chart=='Range' && !value.available" class="data-na">Data Not Available</div>

    <sankey v-if="school && config.chart=='Sankey'" :school="school" colors="solid" :currentSankey="config.currentSankey" />

    <multi-range 
        v-if="school && config.chart=='MultiRange'"
        :minmax="value"
        :variable="config.multiRangeVariable" 
        :max="config.max? config.max: { label: '$150,000', value: 150000 }"
    />

    <div
        v-if="school && config.chart=='SchoolInfo'"
    >
        <v-row>
            <v-col cols="12" sm="6">
                <school-icons :school="school" :fields="fields" />
            </v-col>
            <v-col cols="12" sm="3" class='text-center'>
                <h2 class='navy-text'>{{ this.undergraduates | separator}}</h2> 
                undergraduates
            </v-col>
            <v-col cols="12" sm="3" class='text-center'>
               <v-chip small v-if="underInvestigation==1" color="error" label>
                  <strong>Under ED Monitoring</strong>
                  <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" :isBranch="isBranch" />
                </v-chip>
                <a
                target="_blank"
                :href="$baseUrl+'/school/transition/?url='+schoolUrl"
                >{{ _.get(school, fields['SCHOOL_URL'], 'ed.gov') | formatUrlText }}</a>
            </v-col>

        </v-row>
    </div>

    <div
      v-if="school && config.chart=='estimatedParentBorrowed'"
      >
        <div
          v-if="estimatedParentBorrowedText"
          class="display-2 navy-text font-weight-bold"
        >{{estimatedParentBorrowedText}}
        </div>
        <div v-else class="data-na">Data Not Available</div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.data-na {
  padding: 0;
  background-color: #FAFAFA;
  margin: 0 !important;
  font-size: 0.9rem;
  min-height: 30px;
}
.active{
    background-color: #faefd2 !important;
}
</style>

<script>
import HorizontalBar from "components/vue/HorizontalBar.vue";
import Range from "components/vue/Range.vue";
import MultiRange from "components/vue/MultiRange.vue";
import Sankey from "components/vue/Sankey.vue";
import SchoolIcons from "components/vue/SmallSchoolIcons.vue";
import ComplexFields from "vue/mixins/ComplexFields.js";
import Tooltip from "components/vue/Tooltip.vue";

export default {
  mixins: [ComplexFields],
  components: {
    "horizontal-bar": HorizontalBar,
    range: Range,
    sankey: Sankey,
    "multi-range": MultiRange,
    "school-icons": SchoolIcons,
    "tooltip": Tooltip
  },
  props: {
    school: {
      type: Object
    },
    config: {
        type: Object
    },
    currentHighlight:{
        type: String
    }
  },
  computed: {
    classes(){
        return{
            active: "school-"+this.school.id == this.currentHighlight,
            'pb-1': true,
            'px-sm-5': true,
            "px-1": true
        }
    },
    value() {
      if(this.config.currentRaceEthnicityFilter){
        let entry =  this.raceEthnicity.filter(obj => obj.label === this.config.currentRaceEthnicityFilter)
        return Math.round(entry[0].value*100);
      } else if (this.config.currentIncomeFilter){
          return this.income[this.config.currentIncomeFilter];
      } else if (this.config.type == "percent") {
        return Math.round(this[this.config.computedField] * 100);
      }else if(this.config.multiRangeReactive){
        return this.generateDebtRange(this.allFieldsOfStudy, this.config.multiRangeAidShowMedianDebtWithPrior, this.config.multiRangeAidLoanSelect);
      } else {
        return this[this.config.computedField];
      }
    }

  }
};
</script>
