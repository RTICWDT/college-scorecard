<template>
  <v-app id="data-glossary">
<template>
  <v-app id="data-glossary">
    <scorecard-header active-link="data"
      :compare-institutions-count="compareSchools.length"
      :compare-fields-of-study-count="compareFieldsOfStudy.length"
    />

    <scorecard-header active-link="data"
      :compare-institutions-count="compareSchools.length"
      :compare-fields-of-study-count="compareFieldsOfStudy.length"
    />

    <v-main>
      <data-navigation current="/data/glossary/" />
      <v-container>
        <v-row>
          <v-col cols="12" md="10" offset-md="1">
            <v-card class='py-5 px-10 ma-5'>
              <h1 class="display-1 mb-2 font-weight-bold">Glossary</h1>
              <div v-for="entry in glossary" :key="entry.id" v-if="entry.glossary">
                <h3 :id="entry.id" class="mt-4">{{entry.title}}</h3>
                <div v-html="entry.glossary"></div>
              </div>
            </v-card>
          </v-col>
        </v-row>
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
import DataNavigation from 'components/vue/DataNavigation.vue';
import CompareDrawer from "components/vue/CompareDrawer.vue";
import CompareHeader from "components/vue/CompareHeader.vue";
import { compare } from "vue/mixins.js";
import { EventBus } from "../EventBus.js";

export default {
  mixins: [compare],
  components: {
    'data-navigation': DataNavigation,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
  },
  props: ["baseUrl", "dataBase_url",'compareSchools','compareFieldsOfStudy'],
  computed: {
    glossary() {
      let glossary = siteDataAll.glossary;
      for (var key in glossary) {
        glossary[key].id = key;
      }
      return _.orderBy(siteDataAll.glossary, 'title');
    }
  },
  mounted() {
    if (window.location.hash) {
      this.$vuetify.goTo(window.location.hash, { offset: 30 })
    }

    EventBus.$on('compare-drawer-show', (showCompareInfo) => {
        this.showCompare = true;
        this.showInfoText = showCompareInfo;
    });
  }
};
</script>