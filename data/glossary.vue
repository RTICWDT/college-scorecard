<template>
  <v-app>
    <data-navigation current="/data/glossary/" />
    <v-container>
      <v-row>
        <v-col cols="12" md="7">
          <h1 class="display-1 mb-2">Glossary</h1>
          <p>Glossary content TBD.</p>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import DataNavigation from 'components/vue/DataNavigation.vue';
export default {
  components: {
    'data-navigation': DataNavigation
  },
  props: ["baseUrl", "dataBase_url", "dataDictionary"],
};
</script>