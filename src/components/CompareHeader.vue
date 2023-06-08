<template>
  <div
    id="compare-header"
    class="header pa-3 elevation-4 d-print-none"
    @click="toggleDrawer()"
    v-show="currentSchoolCount > 0 || currentFieldOfStudyCount > 0"
  >
    <div class="compare-header-text ml-8 mr-6 mb-1 d-none d-sm-inline">
      <v-icon class="mt-1" color="black" size="24"> </v-icon>

      Ready to Compare:
    </div>
    <div v-if="currentSchoolCount < 10" class="compare-header-text mb-1 ml-4 mr-2">
      <div
        class="compare-icon-wrapper d-inline-block mr-2"
        style="background: #83c38c;"
      >
        <v-icon class="mt-1" color="black" size="24">
          fas fa-university
        </v-icon>
      </div>
      {{ currentSchoolCount }} {{ schoolText }} &nbsp;&nbsp;
    </div>
    <div v-else class="compare-header-text mb-1 ml-4 mr-2">
      <div class="compare-icon-wrapper d-inline-block mr-2 mt-n1">
        <v-icon
          class="mt-1"
          color="red"
          medium
          style="font-size:40px;border-radius:50%;"
        >
          fas fa-exclamation-circle
        </v-icon>
      </div>
      Maximum of 10 Schools reached &nbsp;&nbsp;
    </div>
    <div
      v-if="currentFieldOfStudyCount < 10"
      class="compare-header-text mb-1 ml-4"
    >
      <div
        class="compare-icon-wrapper d-inline-block mr-2"
        style="background: #fec005;"
      >
        <v-icon class="mt-1" color="black" size="24">
          fas fa-award
        </v-icon>
      </div>
      {{ currentFieldOfStudyCount }} {{ fieldOfStudyText }}
    </div>
    <div v-else class="compare-header-text mb-1 ml-4">
      <div class="compare-icon-wrapper d-inline-block mr-2 mt-n1">
        <v-icon
          class="mt-1"
          color="red"
          medium
          style="font-size:40px;border-radius:50%;"
        >
          fas fa-exclamation-circle
        </v-icon>
      </div>
      Maximum of 10 Fields of Study reached &nbsp;&nbsp;
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";
.header {
  position: fixed;
  width: 50%;
  left: 25%;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.98);
  color: #ffffff;
  z-index: 200;
  border-radius: 3px 3px 0 0;
  cursor: pointer;
  @media only screen and (max-width: 600px) {
    width: 100%;
    left: 0;
  }
}

.compare-icon-wrapper {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
}

.compare-header-text {
  line-height: 2;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  height: 40px;
  @media only screen and (max-width: 600px) {
    display:inline;
  }  
}
</style>

<script>
export default {
  methods: {
    toggleDrawer() {
      this.$store.commit("toggleDrawer", true)
    },
  },
  computed: {
    currentSchoolCount() {
      return this.$store.state.institutions.length
    },
    currentFieldOfStudyCount() {
      return this.$store.state.fos.length
    },
    schoolText() {
      return this.$store.state.institutions.length > 1 ||
        this.$store.state.institutions.length === 0
        ? "Schools"
        : "School"
    },
    fieldOfStudyText() {
      return this.$store.state.fos.length > 1 ||
        this.$store.state.fos.length === 0
        ? "Fields of Study"
        : "Field of Study"
    },
  },
}
</script>
