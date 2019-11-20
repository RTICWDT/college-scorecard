<style lang="scss">
.nameLink {
  text-decoration: none;
  line-height: 125%;
}
.search-result-card {
  border: 4px
    solid
    #ffffff !important;
  width: 100%;
}
.result-card-selected {
  border: 4px
    solid
    #eeba28 !important;
}
</style>

<template>
  <v-card
    class="search-result-card mx-auto pa-0 elevation-4"
    outlined
    :class="{'result-card-selected': isSelected}"
  >
    <!-- Better Selected style -->
    <v-card-text class="pa-3">
      <p class="mt-1 mb-2" v-if="underInvestigation==1">
        <v-card color="error" class="px-2 py-1" flat>
          <strong class="white--text">Under ED Monitoring</strong>
          <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" />
        </v-card>
      </p>

      <v-btn
        text
        icon
        class="float-right search-result-card-compare"
        :color="isSelected?'amber':'grey'"
        @click="$emit('toggle-compare-school',school)"
      >
        <v-icon>fa fa-plus-circle</v-icon>
        <span class='sr-only'>Compare</span>
      </v-btn>
      <p class="overline font-weight-bold mb-1">{{ city }}, {{ state }}</p>
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
      <v-row class="v-flex align-center">
        <v-col cols="7" class="py-2">
          <!--prettyhtml-ignore-->
          <span>Graduation Rate&nbsp;<tooltip definition="graduation-rate" :version="completionRateFieldDefinition" /></span>
        </v-col>
        <v-col cols="5" class="pr-0 text--black py-2">
          <h3 class="navy-text">{{displayGradRate}}</h3>
        </v-col>
      </v-row>
      <v-row class="result-card-info-container v-flex align-center">
        <v-col cols="7" class="py-2">
          <!--prettyhtml-ignore-->
          <span>Salary After Completing&nbsp;<tooltip definition="fos-median-earnings" :isBranch="isBranch" /></span>
        </v-col>
        <v-col cols="5" class="pr-0 text--black py-2">
          <h3 class="navy-text">{{displayEarn}}</h3>
        </v-col>
      </v-row>
      <v-row class="result-card-info-container v-flex align-center">
        <v-col cols="7" class="py-2">
          <!--prettyhtml-ignore-->
          <span v-if="!isProgramReporter">Average Annual Cost&nbsp;<tooltip definition="avg-cost" /></span>
          <!--prettyhtml-ignore-->
          <span v-else>Average Annual Cost for Largest Program&nbsp;<tooltip definition="avg-program-cost" /></span>
        </v-col>
        <v-col cols="5" class="pr-2 text--black py-0">
          <h3 class="navy-text">{{displayAvgCost}}</h3>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import numeral from 'numeral';
import Tooltip from './Tooltip.vue';
import SmallSchoolIcons from './SmallSchoolIcons.vue';
import ComplexFields from '../../vue/mixins/ComplexFields.js';

export default {
  mixins: [ComplexFields],
  components: {
    tooltip: Tooltip,
    'small-school-icons': SmallSchoolIcons
  },
  props: {
    "school": Object,
    "isSelected": Boolean
  },
  computed: {

    displayGradRate() {
      if (!this.completionRate) {
        return 'N/A';
      }
      else {
        return this.$options.filters.numeral(this.completionRate, '0.%');
      }
    },
    displayEarn() {
      if (!this.earningsRange) {
        return 'N/A';
      }
      else if (this.earningsRange.single) {
        return this.$options.filters.numeral(this.earningsRange.min.earnings.median_earnings, '$0a');
      }
      else {
        return this.$options.filters.numeral(this.earningsRange.min.earnings.median_earnings, '$0a') + '-' + this.$options.filters.numeral(this.earningsRange.max.earnings.median_earnings, '0a');
      }

    },
    displayAvgCost() {
      if (!this.netPrice) {
        return 'N/A';
      }
      else {
        return this.$options.filters.numeral(this.netPrice, '$0a');
      }
    }
  }
}
</script>
