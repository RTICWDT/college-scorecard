<template>
  <v-app id="data-glossary">

    <scorecard-header active-link="data"/>

    <v-content>
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
    </v-content>
    <scorecard-footer />
  </v-app>
</template>

<script>
import DataNavigation from 'components/vue/DataNavigation.vue';
export default {
  components: {
    'data-navigation': DataNavigation
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
  }
};
</script>