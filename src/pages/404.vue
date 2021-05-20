<template>
  <v-app id="four-oh-four">
    <scorecard-header />
    <v-main class="home-splash">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <v-card class="pa-5 text-center mt-10">
              <h1 class="pb-3">Page Not Found</h1>
              <p>
                We couldn't find the page you were looking for. Try searching
                again?
              </p>
              <name-autocomplete
                @school-name-selected="handleSchoolNameSelected"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <scorecard-footer />

    <compare-header :showCompare.sync="showCompare" />

    <v-bottom-sheet id="compare-modal" v-model="showCompare" inset>
      <compare-drawer
        :show-info-text="showInfoText"
        @toggle-compare-school="handleToggleCompareItem"
        v-on:close-modal="closeModal()"
        @toggle-more-info="showInfoText = !showInfoText"
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
import NameAutocomplete from "~/components/NameAutocomplete.vue"
import { compare } from "~/js/mixins.js"
import CompareDrawer from "~/components/CompareDrawer.vue"
import CompareHeader from "~/components/CompareHeader.vue"
import { EventBus } from "~/js/EventBus.js"

export default {
  mixins: [compare],
  components: {
    "name-autocomplete": NameAutocomplete,
    "compare-drawer": CompareDrawer,
    "compare-header": CompareHeader,
  },
  methods: {
    handleSchoolNameSelected(school) {
      if (typeof school == "string") {
        window.location = "/search/?name=" + encodeURIComponent(school)
      } else {
        window.location =
          "/search/?name=" +
          encodeURIComponent(school["school.name"]) +
          "&id=" +
          school.id
      }
    },
  },
  mounted() {
    EventBus.$on("compare-drawer-show", (showCompareInfo) => {
      this.showCompare = true
      this.showInfoText = showCompareInfo
    })
  },
}
</script>
