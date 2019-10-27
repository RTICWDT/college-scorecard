<template>
  <v-app>
        <scorecard-header />

    <v-content class="white">
      <data-navigation current="/data/glossary/" />
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="8"
          >
            <h1 class="display-1 mb-2">Glossary</h1>
            <div
              v-for="(entry,key) in glossary"
              :key="key"
              v-if="entry.glossary"
            >
              <h3
                :id="key"
                class='mt-4'
              >{{entry.title}}</h3>
              <div v-html="entry.glossary"></div>
            </div>
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
  props: ["baseUrl", "dataBase_url"],
  computed: {
    glossary() {
      return _.orderBy(siteDataAll.glossary, 'title');
    }
  }
};
</script>