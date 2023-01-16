<template>
  <div>
    <v-navigation-drawer
      v-model="showSidebar"
      app
      width="300"
      class="searchSidebar"
      overlay
      clipped
    >
      <!-- Search Fields of Study Component -->
      <search-fos-form
        :url-parsed-params="urlParsedParams"
        auto-submit
        @search-query="handleFieldOfStudySearch"
      />
    </v-navigation-drawer>
    <v-main>
      <v-card tile>
        <v-btn class="float-right" @click="showSidebar = !showSidebar">
          Show Drawer
        </v-btn>
        <v-tabs class="">
          <p class="'mb-0'">SEARCH FOR:</p>
          <v-tab to="/search/" color="#007000">
            School
          </v-tab>

          <v-tab
            to="/search/fos/"
            @click="displayToggle = 'fos'"
            color="#fdbf32"
          >
            Field of Study
          </v-tab>
        </v-tabs></v-card
      >
      <p>
        This is where the FoS work should go.
      </p>
    </v-main>
  </div>
</template>
<script>
export default {}
</script>
