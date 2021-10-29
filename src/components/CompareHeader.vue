<template>
<div class="compare-header-wrapper">
  <div
    id="compare-header"
    class="header pa-3 elevation-4"
    @click="toggleDrawer()"
    v-show="currentSchoolCount > 0 || currentFieldOfStudyCount > 0 && showByIndex == 1"
  >
  <v-row>
    <v-col cols='2'  >
      <div class="compare-header-text mr-12  mb-1">

          <v-icon class="mt-1" color="black"  size="24">
            
          </v-icon>
       
        Ready to Compare: </div>
    </v-col>
    <v-col  cols='5'>
      <div v-if="currentSchoolCount < 10" class="compare-header-text mb-1 ml-4">
        <div
          class="compare-icon-wrapper d-inline-block mr-2"
          style="background: #83c38c;"
        >
          <v-icon class="mt-1" color="black"  size="24">
            fas fa-university
          </v-icon>
        </div>
        {{ currentSchoolCount }} {{ schoolText }} &nbsp;&nbsp;
      </div>
      <div v-else class="compare-header-text mb-1 ml-4">
        <div
          class="compare-icon-wrapper d-inline-block mr-2 mt-n1"
        >
          <v-icon class="mt-1" color="red" medium style="font-size:40px;border-radius:50%;">
            fas fa-exclamation-circle
          </v-icon>
        </div>
        Maximum of 10 Schools reached &nbsp;&nbsp;
      </div>
    </v-col>
    <v-col cols='5'>
      <div
        v-if="currentFieldOfStudyCount < 10"
        class="compare-header-text mb-1 ml-4 mr-6"
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
      </div>
      <div v-else class="compare-header-text mb-1 ml-4 mr-6">
        <div
          class="compare-icon-wrapper d-inline-block mr-2 mt-n1"
        >
          <v-icon class="mt-1" color="red" medium style="font-size:40px;border-radius:50%;">
            fas fa-exclamation-circle
          </v-icon>
        </div>
        Maximum of 10 Fields of Study reached &nbsp;&nbsp;
      </div>
    </v-col>
  </v-row>
  </div>
</div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";
.header {
  background-color: rgba(0, 0, 0, 0.98);
  color: #ffffff;
  width:50%;
  border-radius: 3px 3px 0 0;
  cursor: pointer;
  @media only screen and (max-width: 600px) {
    width: 100%;
    left: 0;
  }
}

.compare-header-wrapper {
  position: fixed;
  bottom:0px;
  display:flex;
  justify-content: center;
  width:100%;
   z-index: 200;
}

.compare-icon-wrapper {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
}

.compare-header-text {
  line-height: 2.0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  height:40px;
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
