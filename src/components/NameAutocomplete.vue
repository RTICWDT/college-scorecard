<template>
  <div>
    <v-combobox
      :items="items"
      :loading="isLoading"
      v-model="search"
      search.sync="search"
      item-text="school.name"
      placeholder="Enter a School"
      autocomplete="off"
      hide-details
      class="pt-0 mt-0"
      color="institution-search-color"
      outlined
      prepend-inner-icon="fas fa-search"
      hide-no-data
      return-object
      @input="goToSchool"
      :value="initial_school"
      @update:search-input="runSearch"
      aria-label="Name Search"
      no-filter
      :dense="dense"
    >
      <!-- TODO - Add markup for alias match or highlighting -->
      <template slot="item" slot-scope="{ parent, item }">
        <span class="name-complete-school-name">{{ item["school.name"] }}</span>
      </template>
    </v-combobox>
  </div>
</template>

<style lang="scss">
@import "~/sass/_variables.scss";
.v-application .institution-search-color--text {
  color: $darker-green !important;
}
</style>

<script>
import { apiGet } from "~/js/api.js"
import { fields } from "~/js/constants.js"
import PrepareParams from "~/js/mixins/PrepareParams.js"
import _ from "lodash"

export default {
  mixins: [PrepareParams],
  props: {
    initial_school: {
      type: String,
      default: null,
    },
    searchEmptyName: {
      type: Boolean,
      default: true,
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    items: [],
    isLoading: false,
    search: null,
  }),
  methods: {
    goToSchool: function() {
      this.items = []
      if (this.search) {
        this.$emit("school-name-selected", this.search)
      } else if (this.searchEmptyName) {
        this.$emit("school-name-selected", "")
      }
    },
    customFilter(item, queryText, itemText) {
      return true
    },
    runSearch: _.debounce(function(newVal) {
      if (newVal) {
        this.isLoading = true
        var query = {
          fields: [fields.ID, fields.NAME, fields.ALIAS, fields.SEARCH].join(
            ","
          ),
          per_page: 20,
          sort: `alias:asc`, // Not perfect, helps to ensure items with alias are on first page.
        }

        query["school.search"] = newVal ? newVal : ""
        query[fields.OPEID + "__not"] = "null"
        query = this.prepareParams(query)

        let request = apiGet("/schools", query)
          .then((response) => {
            if (!response.data.results.length) {
              return {}
            }
            let schools = response.data.results
            let processed = {}

            // Promote alias match to the top, remove from result list
            let aliasMatch = _.remove(schools, (school) => {
              if (!school["school.alias"]) return false

              let lowerAlias = school["school.alias"].toLowerCase()
              let aliasWords = _.words(lowerAlias)

              // If there is an exact match OR an exact match on words
              if (
                newVal.toLowerCase() === lowerAlias ||
                _.includes(aliasWords, newVal.toLowerCase())
              ) {
                return true
              } else {
                return false
              }
              // return school['school.alias'] && school['school.alias'].toLowerCase().indexOf(newVal.toLowerCase()) > -1;
            })

            // TODO - Demote items that do not have search text in school name
            // TODO - Main campus to the top?=
            // console.log("Alias Match: " + JSON.stringify(aliasMatch));

            if (aliasMatch.length > 0) {
              // Add flag for alias Match
              aliasMatch = aliasMatch.map((i) => {
                return { ...i, alias: true }
              })

              // Add to the front of the result array
              schools.unshift(...aliasMatch)
            }

            this.items = schools
            this.isLoading = false
          })
          .catch((error) => {
            this.items = []
            this.isLoading = false
          })
      }
    }, 300),
  },
  mounted() {
    this.search = this.initial_school
    this.$root.$on("search-form-reset", (e) => {
      this.search = null
    })
  },
}
</script>
