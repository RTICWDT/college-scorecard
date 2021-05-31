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
}
.result-card-selected {
  border: 4px solid #a6cfe4 !important;
}

.moreDetails {
  font-size: 0.9rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>

<template>
  <v-card
    class="search-result-card mx-auto pa-0 elevation-4"
    outlined
    :class="{ 'result-card-selected': isSelected }"
  >
    <!-- Better Selected style -->
    <v-card-text class="pa-3">
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
            v-bind="attrs"
            v-on="on"
            aria-label="Add to compare"
          >
            <v-icon>fa fa-check-circle</v-icon>
            <span class="sr-only">Compare</span>
          </v-btn>
        </template>

        <span>Add School to compare</span>
      </v-tooltip>

      <p class="overline mb-1">{{ city }}, {{ state }}</p>
      <h2 class="title mt-0 font-weight-bold">
        <a class="nameLink" :href="schoolLink">{{ schoolName }}</a>
      </h2>
      <p class="body-2 mt-1">{{ undergraduates | separator }} undergrads</p>
      <v-divider />
      <v-row>
        <v-col cols="12">
          <small-school-icons :school="school" :fields="fields" size="small" />
        </v-col>
      </v-row>
      <v-divider />
      <p class="overline mb-0 pt-3">Institutional Highlights:</p>
      <v-row class="v-flex align-center">
        <v-col class="">
          <!--prettyhtml-ignore-->
          <span
            >Graduation Rate&nbsp;<tooltip
              definition="graduation-rate"
              :version="completionRateFieldDefinition"
          /></span>
        </v-col> </v-row
      ><v-row class="mt-0">
        <v-col class="text--black py-0">
          <h3 class="navy-text ma-0 pa-0">{{ displayGradRate }}</h3>
        </v-col>
      </v-row>
      <v-row class="result-card-info-container v-flex align-center">
        <v-col class="py-0 my-0 mt-4">
          <!--prettyhtml-ignore-->
          <span
            >Salary After Completing&nbsp;<tooltip
              definition="fos-median-earnings"
              :isBranch="isBranch"
          /></span>
        </v-col> </v-row
      ><v-row>
        <v-col class="text--black py-0">
          <h3 class="navy-text ma-0">{{ displayEarn }}</h3>
        </v-col>
      </v-row>
      <v-row class="result-card-info-container v-flex align-center">
        <v-col class="py-0 mt-4">
          <!--prettyhtml-ignore-->
          <span v-if="!isProgramReporter"
            >Average Annual Cost&nbsp;<tooltip
              definition="avg-cost"
              :isNegative="netPrice < 0"
          /></span>
          <!--prettyhtml-ignore-->
          <span v-else
            >Average Annual Cost for Largest<br />Program&nbsp;<tooltip
              definition="avg-program-cost"
              :isNegative="netPrice < 0"
          /></span>
        </v-col> </v-row
      ><v-row>
        <v-col class="pr-2 text--black py-0">
          <h3 class="navy-text my-0">{{ displayAvgCost }}</h3>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="">
      <p class="px-1">
        <a :href="schoolLink" class="moreDetails">View More Details &raquo;</a>
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
  },
  computed: {
    displayGradRate() {
      if (!this.completionRate) {
        return "N/A"
      } else {
        return this.$options.filters.numeral(
          parseFloat(this.completionRate),
          "0.%"
        )
      }
    },
    displayEarn() {
      if (!this.earningsRange) {
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
            this.earningsRange.min.earnings.highest["2_yr"]
              .overall_median_earnings,
            "$0a"
          ) +
          "-" +
          this.$options.filters.numeral(
            this.earningsRange.max.earnings.highest["2_yr"]
              .overall_median_earnings,
            "0a"
          )
        )
      }
    },
    displayAvgCost() {
      if (!this.netPrice) {
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
