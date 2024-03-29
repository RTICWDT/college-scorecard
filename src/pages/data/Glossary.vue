<template>
  <v-main>
    <data-navigation :current="$url('/data/glossary/')" />
    <v-container class="px-0">
      <v-row>
        <v-col cols="12">
          <v-card class="py-5 px-10 ma-5 " flat>
            <h1 class="display-1 mb-2 font-weight-bold">Glossary</h1>
            <hr />
            <div
              v-for="entry in glossary"
              :key="entry.id"
              v-if="entry.glossary"
            >
              <h3 :id="entry.id" class="mt-4">{{ entry.title }}</h3>
              <div
                @click="handleClicks"
                class="glossary-text"
                v-html="entry.glossary"
              ></div>
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
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"

export default {
  mixins: [AnalyticsEvents],
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
  methods: {
    handleClicks(event) {
      // ensure we use the link, in case the click has been received by a subelement
      let { target } = event

      while (target && target.tagName !== "A") target = target.parentNode
      // handle only links that occur inside the component and do not reference external resources
      if (target && target.matches(".glossary-text a") && target.href) {
        // some sanity checks taken from vue-router:
        // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
        const {
          altKey,
          ctrlKey,
          metaKey,
          shiftKey,
          button,
          defaultPrevented,
        } = event
        // don't handle with control keys
        if (metaKey || altKey || ctrlKey || shiftKey) return
        // don't handle when preventDefault called
        if (defaultPrevented) return
        // don't handle right clicks
        if (button !== undefined && button !== 0) return

        this.transitionOutboundLink(event)
      }
    },
  },
  metaInfo: {
    title: "Glossary",
    meta: [
      {
        name: 'description',
        content: 'The glossary includes detailed description of every datapoint and relevant data variables on the College Scorecard.'
      },
      {
        name: 'keywords',
        content: 'College Scorecard, Department of Education, ED, college search, higher education, college data, college selection, higher education data, college rankings, IPEDS'
      }
    ],
  },
}
</script>
