<template>
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
              :searchEmptyName="false"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style lang="scss" scoped>
.home-splash {
  padding-top: 1.5rem;
}
</style>

<script>
import NameAutocomplete from "~/components/NameAutocomplete.vue"

export default {
  components: {
    "name-autocomplete": NameAutocomplete,
  },
  methods: {
    handleSchoolNameSelected(school) {
      if (typeof school == "string") {
        this.$router.push("/search/?name=" + encodeURIComponent(school))
      } else {
        this.$router.push(
          "/search/?name=" + encodeURIComponent(school["school.name"]) // +
          //"&id=" +
          //school.id
        )
      }
    },
  },
}
</script>
