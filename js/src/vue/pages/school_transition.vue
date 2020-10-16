<template>
  <v-app id="school-transition">
    <scorecard-header
      :compare-institutions-count="compareSchools.length"
      :compare-fields-of-study-count="compareFieldsOfStudy.length"
    />

    <v-content>
      <div class="home-splash">
        <v-container class="pt-0">
          <v-row>
            <v-col cols="12">
              <h1 class="white--text text-uppercase text-center">You are leaving the College Scorecard</h1>
            </v-col>
          </v-row>
          <v-row>
              <v-col cols="12" sm="8" offset-sm="2">
                  <v-card class='pa-5'>
                      <p>Links are provided by the institutions during data collection and are only updated about once a year. As such, over the course of the year, some links may break or websites may be taken offline.</p>
                      <p>The U.S. Department of Education does not necessarily endorse the views expressed or the data and facts presented on this external site.</p>
                      <v-btn color="secondary" rounded :href="url" v-if="url">Continue to Website</v-btn>    
                      <span v-else class='px-4'><v-icon small>fas fa-exclamation-triangle</v-icon> Invalid URL</span>    
                      <v-btn rounded :href="referrer">Return to Previous Page</v-btn>                    
                  </v-card>
              </v-col>
             
          </v-row>
        </v-container>
      </div>
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
  padding-top: 2.5rem;
}
</style>
<script>
import { EventBus } from "../EventBus.js";
const querystring = require("querystring");
import CompareDrawer from "components/vue/CompareDrawer.vue";
import CompareHeader from "components/vue/CompareHeader.vue";
import { compare } from "vue/mixins.js";

export default {
  mixins: [compare],
  components: {
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
  },
  props: ["baseUrl",'compareSchools','compareFieldsOfStudy'],
  data() {
    return {
      query: {}
    };
  },
  computed:{
      referrer(){
          return document.referrer;
      },
      url(){
          let url = decodeURI(this.query.url);
          if(url.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/))
          {
            return url;
          }
          else
          {
            return false;
          } 
      }
  },
  mounted(){
    let query = querystring.parse(window.location.search.substring(1));
    this.query = query || {};

    EventBus.$on('compare-drawer-show', (e) => {
      this.showCompare = true;
    });
  } 
};
</script>