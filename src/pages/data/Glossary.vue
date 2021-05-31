<template>
  <v-main>
    <data-navigation current="/data/glossary/" />
    <v-container>
      <v-row>
        <v-col cols="12" md="10" offset-md="1">
          <v-card class="py-5 px-10 ma-5">
            <h1 class="display-1 mb-2 font-weight-bold">Glossary</h1>
            <div
              v-for="entry in glossary"
              :key="entry.id"
              v-if="entry.glossary"
            >
              <h3 :id="entry.id" class="mt-4">{{ entry.title }}</h3>
              <div v-html="entry.glossary"></div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import DataNavigation from "~/components/DataNavigation.vue"
import Glossary from "~/data/glossary.json"

export default {
  components: {
    "data-navigation": DataNavigation,
  },
  computed: {
    glossary() {
      for (var key in Glossary) {
        Glossary[key].id = key
      }
      return _.orderBy(Glossary, "title")
    },
  },
  mounted() {
    if (window.location.hash) {
      this.$vuetify.goTo(window.location.hash, { offset: 30 })
    }
  },
}
</script>