<template>
  <v-app id="training">
    <scorecard-header active-link="training"
      :compare-institutions-count="compareSchools.length"
      :compare-fields-of-study-count="compareFieldsOfStudy.length"
    />
    <v-main>
      <v-container>
        
      </v-container>
    </v-main>
    <scorecard-footer />
    <compare-header
      :showCompare.sync="showCompare"
      :schools="compareSchools"
      :fields-of-study="compareFieldsOfStudy"
    />
    <v-bottom-sheet id="compare-modal" v-model="showCompare" inset>
      <compare-drawer
        :schools="compareSchools"
        :fields-of-study="compareFieldsOfStudy"
        :show-info-text="showInfoText"
        @toggle-compare-school="handleToggleCompareItem"
        v-on:close-modal="closeModal()"
        @toggle-more-info="showInfoText = !showInfoText"
      ></compare-drawer>
    </v-bottom-sheet>
  </v-app>
</template>


<script>
import DataNavigation from "components/vue/DataNavigation.vue";
import AnalyticsEvents from "vue/mixins/AnalyticsEvents.js";
import SimpleTooltip from "components/vue/SimpleTooltip.vue";
import { compare } from "vue/mixins.js";
import CompareDrawer from "components/vue/CompareDrawer.vue";
import CompareHeader from "components/vue/CompareHeader.vue";
import { EventBus } from "../EventBus.js";

export default {
  mixins: [AnalyticsEvents, compare],
  components: {
    "simple-tooltip": SimpleTooltip,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
  },
  props: ["baseUrl",'compareSchools','compareFieldsOfStudy'],
  mounted() {
    EventBus.$on('compare-drawer-show', (showCompareInfo) => {
        this.showCompare = true;
        this.showInfoText = showCompareInfo;
    });

    window.location.href = '../'
  }
};
</script>
