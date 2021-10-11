<template>
  <div
    id="compare-header"
    class="header pa-3 elevation-4"
    @click="toggleDrawer()"
    v-if="currentSchoolCount > 0 || currentFieldOfStudyCount > 0"
  >
    <div>
      <span class="compare-header-text ml-8 mr-6">Ready to Compare: </span>
      <span v-if="currentSchoolCount < 10" class="compare-header-text mb-1">
        <div
          class="compare-icon-wrapper d-inline-block mx-2"
          style="background: #C4DEC4;"
        >
          <v-icon class="mt-1" color="#122E51" size="24">
            fas fa-university
          </v-icon>
        </div>
        {{ currentSchoolCount }} {{ schoolText }} &nbsp;&nbsp;
      </span>
      <span v-else class="compare-header-text d-inline-block mb-1 ml-4">
        <v-icon
          color="red"
          medium
          class="mr-2"
          style="font-size:40px;border-radius:50%;"
          >fas fa-exclamation-circle</v-icon
        >Maximum of 10 Schools reached
      </span>
      <span
        v-if="currentFieldOfStudyCount < 10"
        class="compare-header-text mb-1 ml-6"
      >
        <div
          class="compare-icon-wrapper d-inline-block mr-2"
          style="background: #fec005;"
        >
          <v-icon class="mt-1" color="black"  size="24">
            fas fa-award
          </v-icon>
        </div>
        {{ currentFieldOfStudyCount }} {{ fieldOfStudyText }} 
      </span>
      <span v-else class="compare-header-text d-inline-block mb-1 mr-2 ml-6">
        <v-icon
          color="red"
          medium
          class="mr-2"
          style="font-size:30px;border-radius:50%;"
          >fas fa-exclamation-circle</v-icon
        >Maximum of 10 Fields of Study reached
      </span>
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
  box-shadow: 0px 3px 6px #00000029;
  //border: white 3px solid;
  width: 40px;
  height: 40px;
  text-align: center;
}

.compare-header-text {
  line-height: 2.0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import { mapGetters } from "vuex"

export default {
  methods: {
    toggleDrawer() {
      //this.$store.commit("toggleDrawer", true)
    },
  },
  computed: {
    currentSchoolCount() {
      return 5
    },
    currentFieldOfStudyCount() {
      return 5
    },
    schoolText() {
     /* return this.$store.state.institutions.length > 1 ||
        this.$store.state.institutions.length === 0
          ? "Schools"
          : "School"*/
          "Schools"
    },
    fieldOfStudyText() {
      /*return this.$store.state.fos.length > 1 ||
        this.$store.state.fos.length === 0
        ? "Fields of Study"
        : "Field of Study"*/
        "Fields of Study"
    },
  },
}
</script>
