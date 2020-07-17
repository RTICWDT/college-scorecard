<template>
  <v-card id="compare_schools-content" class="pa-5">
    <v-btn icon class="float-right" @click="toggleDrawer()">
      <v-icon>fas fa-times-circle</v-icon>
    </v-btn>
    <p>Add up to 10 Schools and 10 Fields of Study to compare.</p>
    <v-row>
      <v-col cols="12" md="6">
        <p class="title">Compare Schools</p>
        <div class="my-3">
          <v-checkbox
            @change="handleToggleCompareItem(school,schoolKey)"
            :label="school.schoolName"
            v-for="school in schools"
            :key="school.schoolId"
            :value="school.schoolId"
            hide-details
            v-model="selectedSchools"
            color="secondary"
            class="ma-0 pa-0"
          ></v-checkbox>
        </div>
        <p>
          <v-btn rounded color="secondary" :href="$baseUrl+'/compare/'">Compare Schools</v-btn>
        </p>
      </v-col>
      <v-col cols="12" md="6">
        <p class="title">Compare Fields Of Study</p>
        <div class="my-3">
          <v-checkbox
            v-for="fieldOfStudy in fieldsOfStudy"
            @change="handleToggleCompareItem(fieldOfStudy, fieldOfStudyKey)"
            :key="fieldOfStudy.id"
            hide-details
            v-model="selectedFieldsOfStudy"
            :value="generateFieldOfStudyString(fieldOfStudy)"
            color="secondary"
            class="ma-0 pa-0"
          >
            <template v-slot:label>
              <div>
                <span>{{fieldOfStudy.fosTitle}}</span><br>
                <span>{{fieldOfStudy.credentialTitle}}</span><br>
                <span>{{fieldOfStudy.institutionName}}</span>
              </div>
            </template>
          </v-checkbox>
        </div>
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
import {localStorageKeys} from '../../vue/constants';

export default {
  components: {
    share: Share
  },
  props: {
    schools: Array,
    fieldsOfStudy:{
      type: Array
    }
  },
  data() {
    return {
      selectedSchools: [],
      selectedFieldsOfStudy: [],
      fieldOfStudyKey: localStorageKeys.COMPARE_FOS_KEY,
      schoolKey: localStorageKeys.COMPARE_KEY
    };
  },
  watch: {
    schools() {
      this.selectedSchools = _.map(this.schools, "schoolId");
    },
    fieldsOfStudy(){
      this.selectedFieldsOfStudy = _.map(this.fieldsOfStudy, (fieldOfStudy) => {
        return this.generateFieldOfStudyString(fieldOfStudy);
      });
    }
  },
  mounted() {
    this.selectedSchools = _.map(this.schools, "schoolId");
    this.selectedFieldsOfStudy = _.map(this.fieldsOfStudy, (fieldOfStudy) => {
      return this.generateFieldOfStudyString(fieldOfStudy);
    });
  },
  methods: {
    handleToggleCompareSchool(school) {
      // TODO: The fade in/out or keep unchecked.
      // Move to a local state that can be clicked again and eventually refreshed.

      this.$emit("toggle-compare-school", school);
    },
    handleToggleCompareItem(item,key) {
      // TODO: The fade in/out or keep unchecked.
      // Move to a local state that can be clicked again and eventually refreshed.
      console.log(item);
      this.$emit("toggle-compare-school", item, key);
    },
    toggleDrawer() {
      this.$emit("close-modal");
    },
    generateFieldOfStudyString(fosObject){
      return `${fosObject.id}-${fosObject.code}-${fosObject.credentialLevel}`;
    }
  }
};
</script>