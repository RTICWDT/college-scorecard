<template>
  <v-app id="four-oh-four">
    <scorecard-header
      :compare-institutions-count="compareSchools.length"
      :compare-fields-of-study-count="compareFieldsOfStudy.length"
    />
    <v-content class="home-splash">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <v-card class='pa-5 text-center mt-10'>
            <h1 class='pb-3'>Page Not Found</h1>
            <p>We couldn't find the page you were looking for. Try searching again?</p>
            <name-autocomplete @school-name-selected="handleSchoolNameSelected"/>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
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
        @toggle-compare-school="handleToggleCompareItem"
        v-on:close-modal="closeModal()"
      ></compare-drawer>
    </v-bottom-sheet>
  </v-app>
</template>

<style lang="scss" scoped>
.home-splash {
  padding-top: 1.5rem;
}
</style>

<script>
import NameAutocomplete from 'components/vue/NameAutocomplete.vue';
import { compare } from "vue/mixins.js";
import CompareDrawer from "components/vue/CompareDrawer.vue";
import CompareHeader from "components/vue/CompareHeader.vue";
import { EventBus } from "../EventBus.js";

export default {
  mixins:[compare],
  components: {
    'name-autocomplete': NameAutocomplete,
    'compare-drawer': CompareDrawer,
    'compare-header': CompareHeader,
  },
  props:['baseUrl','pagePermalink','compareSchools','compareFieldsOfStudy'],
  methods:{
    handleSchoolNameSelected(school){
      if(typeof school == "string")
      {
        window.location = this.$baseUrl+'/search/?name=' + encodeURIComponent(school);
      }
      else
      {
        window.location = this.$baseUrl+'/search/?name=' + encodeURIComponent(school['school.name']) + "&id="+school.id;
      }
    }
  },
  mounted() {
    EventBus.$on('compare-drawer-show', (e) => {
      this.showCompare = true;
    });
  }
}
</script>