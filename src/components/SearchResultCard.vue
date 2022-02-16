<style lang="scss">
.nameLink {
  text-decoration: none;
  line-height: 125%;
  &:hover {
    text-decoration: underline;
  }
}
.search-result-card {
  border: 4px solid #ffffff !important;
  width: 100%;
  position: realtive;
  padding-bottom: 60px;
}
.result-card-selected {
  border: 4px solid #a6cfe4 !important;
}
.card-actions {
  position: absolute;
  bottom: 0;
}

.moreDetails {
  font-size: 0.9rem;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
}

.noCompareAllow {
  cursor: not-allowed !important;
}

.search-result-card {
  h3 {
    font-size:24px;
  }
}
</style>

<template>
  <v-card
    class="search-result-card mx-auto elevation-0"
    outlined
    :class="{ 'result-card-selected': isSelected }"
  >
    <!-- Better Selected style -->
    <v-card-text class="pa-3" style="flex-grow:1">
      <p class="mt-1 mb-2" v-if="underInvestigation == 1">
        <v-card color="error" class="px-2 py-1" flat>
          <strong class="white--text">Under ED Monitoring</strong>
          <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" />
        </v-card>
      </p>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            icon
            class="float-right search-result-card-compare"
            :color="isSelected ? '#0075B2' : 'grey'"
            @click="$store.commit('toggleSchool', school)"
            :class="isSelected ? '' : (compareSchoolsLength > 9 ? 'noCompareAllow' : '')"
            v-bind="attrs"
            v-on="on"
            aria-label="Add to compare"
          >
            <v-icon>fa fa-check-circle</v-icon>
            <span class="sr-only">Compare</span>
          </v-btn>
        </template>

        <!--<span>Add School to compare</span>-->
        <div class="hover-tip">{{compareHoverCountText}}</div>
      </v-tooltip>

      <p class="overline mb-1">{{ city }}, {{ state }}</p>
      <h2 class="title mt-0 font-weight-bold">
        <a class="nameLink" :href="$url(schoolLink)">{{ schoolName }}</a>
      </h2>
      <!--<p class="body-2 mt-1">{{ undergraduates | separator }} undergrads</p> -->

      <v-row>
        <v-col cols="12">
          <small-school-icons :school="school" :fields="fields" size="small" />
        </v-col>
      </v-row>
      <v-divider class="pb-3"/>
      <!-- <p class="overline mb-0 pt-3">Institutional Highlights:</p>-->
      <v-row class="v-flex align-center">
        <v-col class="pb-1">
          <!--prettyhtml-ignore-->
          <span
            >Graduation Rate&nbsp;<tooltip
              definition="graduation-rate"
              :version="completionRateFieldDefinition"
          /></span>
        </v-col> </v-row
      ><v-row class="mt-1">
        <v-col class="text--black py-0">
          <h3 class="navy-text ma-0 pa-0">{{ displayGradRate }}</h3>
        </v-col>
      </v-row>
      <v-row class="v-flex align-center">
        <v-col class="pb-1">
          <!--prettyhtml-ignore-->
          <span v-if="!isProgramReporter"
            >Average Annual Cost&nbsp;<tooltip
              definition="avg-cost"
              :isNegative="netPrice < 0"
          /></span>
          <!--prettyhtml-ignore-->
          <span v-else
            >Average Annual Cost for Largest Program&nbsp;<tooltip
              definition="avg-program-cost"
              :isNegative="netPrice < 0"
          /></span>
        </v-col> </v-row
      ><v-row class="mt-1">
        <v-col class="text--black py-0">
          <h3 class="navy-text ma-0 pa-0">{{ displayAvgCost }}</h3>
        </v-col>
      </v-row>
      <v-row class="v-flex align-center">
        <v-col class="pb-1">
          <!--prettyhtml-ignore-->
          <span
            >Median Earnings&nbsp;<tooltip
              definition="institution-median-earnings"
              :isBranch="isBranch"
          /></span>
        </v-col> </v-row
      ><v-row class="mt-1">
        <v-col class="text--black py-0">
          <h3 class="navy-text ma-0">{{ displayEarn }}</h3>
        </v-col>
      </v-row>      
    </v-card-text>
    <v-card-actions class="card-actions">
      <p class="px-1">
        <a :href="$url(schoolLink)" class="moreDetails">View More Details &raquo;</a>
      </p>
    </v-card-actions>
  </v-card>
</template>

<script>
import numeral from "numeral"
import Tooltip from "~/components/Tooltip.vue"
import SmallSchoolIcons from "~/components/SmallSchoolIcons.vue"
import ComplexFields from "~/js/mixins/ComplexFields.js"

export default {
  mixins: [ComplexFields],
  components: {
    tooltip: Tooltip,
    "small-school-icons": SmallSchoolIcons,
  },
  props: {
    school: Object,
    "schoolsCount": Number,    
  },
  computed: {
    displayGradRate() {
      if (!this.completionRateOverall) {
        return "N/A"
      } else {
        return this.$options.filters.numeral(
          parseFloat(this.completionRateOverall),
          "0.%"
        )
      }
    },
    compareHoverCountText() {
      if (this.$store.state.institutions.length > 9){
        return "Maximum of 10 Schools reached";
      }
      else{
        return "Add School to compare";
      }
    },
    compareSchoolsLength() {
      return this.$store.state.institutions.length;
    },    
    displayEarn() {
      /*if (!this.earningsRange) {
        return "N/A"
      } else if (this.earningsRange.single) {
        return this.$options.filters.numeral(
          this.earningsRange.min.earnings.highest["2_yr"]
            .overall_median_earnings,
          "$0a"
        )
      } else {
        return (
          this.$options.filters.numeral(
            this.earningsRange.max.earnings.highest["2_yr"]
              .overall_median_earnings,
            "$0a"
          )
        )
      }*/
      if (!this.medianEarnings) {
        return "N/A";
      }
      else {
        return this.$options.filters.numeral(this.medianEarnings, "$0a")
      }
    },
    displayAvgCost() {
      if (!this.netPrice) {
        //console.log(this.netPrice)
        return "N/A"
      } else {
        return this.$options.filters.numeral(this.netPrice, "$0a")
      }
    },
    isSelected() {
      return (
        this.$store.state.institutions.find(
          ({ schoolId }) => schoolId == this.school.id
        ) != undefined
      )
    },
  },
}
</script>
