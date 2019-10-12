<template>
  <div :class="classes" @click="$emit('update-highlight', 'school-'+school.id);">
    <p class="subtitle-1 pb-0 mb-0">{{_.get(school, fields['NAME'])}}</p>

    <horizontal-bar
      v-if="school && config.chart=='HorizontalBar' && value"
      :value="value"
      :min="0"
      :max="config.max"
      :color="config.color"
      :height="15"
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
            <v-col cols="6">
                <school-icons :school="school" :fields="fields" />
            </v-col>
            <v-col class='text-center'>
                <h2 class='navy-text'>{{ this.undergraduates | separator}}</h2> 
                undergraduates
            </v-col>
            <v-col>
                <a
                target="_blank"
                :href="'/school/transition/?url='+schoolUrl"
                >{{ _.get(school, fields['SCHOOL_URL'], 'ed.gov') | formatUrlText }}</a>
            </v-col>

        </v-row>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.data-na {
  padding: 5px 0;
  background-color: #FAFAFA;
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
export default {
  mixins: [ComplexFields],
  components: {
    "horizontal-bar": HorizontalBar,
    range: Range,
    sankey: Sankey,
    "multi-range": MultiRange,
    "school-icons": SchoolIcons
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
            'py-2': true,
            'px-5': true
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
      } else {
        return this[this.config.computedField];
      }
    }

  }
};
</script>
