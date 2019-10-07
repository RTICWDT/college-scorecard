<template>
  <v-card id="compare_schools-content" class="pa-5">
    <v-btn icon class="float-right" @click="toggleDrawer()">
      <v-icon>fas fa-times-circle</v-icon>
    </v-btn>
    <p class="title">Compare Schools</p>
    <v-row>
      <v-col cols="12" sm="6">
        <p>You can star up to 10 schools to compare.</p>
        <div class="my-3">
          <v-checkbox
            @change="handleToggleCompareSchool(school)"
            :label="school.schoolName"
            v-for="school in schools"
            :key="school.schoolId"
            :value="school.schoolId"
            hide-details
            v-model="selected"
            color="secondary"
            class="ma-0 pa-0"
          ></v-checkbox>
        </div>
        <p>
          <v-btn rounded color="secondary" href="/compare/">Compare Schools</v-btn>
        </p>
      </v-col>
      <v-col cols="12" sm="6">
        <p>
          <share :url="shareUrl" label="Share this Comparison" />
        </p>
      </v-col>
    </v-row>
  </v-card>
</template>
<style lang="scss" scoped>
.v-input--selection-controls.v-input .v-label {
  color: #ffffff !important;
}
</style>
<script>
// This can work on any page, it just needs data passed in and events to react when school
// is toggled.
import Share from "components/vue/Share.vue";

export default {
  components: {
    share: Share
  },
  props: {
    schools: Array
  },
  data() {
    return {
      selected: Array
    };
  },
  computed: {
    shareUrl() {
      let url = "";
      this.schools.map(function(itm, idx) {
        url += "&s[]=" + itm.schoolId;
      });
      return window.location.origin+'/compare/?'+encodeURIComponent(url.substr(1));
    }
  },
  watch: {
    schools() {
      this.selected = _.map(this.schools, "schoolId");
    }
  },
  mounted() {
    this.selected = _.map(this.schools, "schoolId");
  },
  methods: {
    handleToggleCompareSchool(school) {
      // TODO: The fade in/out or keep unchecked.
      // Move to a local state that can be clicked again and eventually refreshed.

      this.$emit("toggle-compare-school", school);
    },
    toggleDrawer() {
      this.$emit("close-modal");
    }
  }
};
</script>