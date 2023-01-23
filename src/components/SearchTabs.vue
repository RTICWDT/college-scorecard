<template>
  <v-tabs>
    <div class="mb-0 px-5 d-flex align-self-center black--text">
      <strong>SEARCH:</strong>
    </div>
    <v-tab to="/search/" color="#007000">
      Schools
    </v-tab>

    <v-tab to="/search/fos" color="#fdbf32">
      Fields of Study
    </v-tab>
  </v-tabs>
</template>

<style lang="scss" scoped>
.v-tab {
  letter-spacing: normal;
  text-transform: none;
}
</style>
