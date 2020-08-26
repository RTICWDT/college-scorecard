<template>
  <v-card id="compare-schools-content" class="pa-5">
    <v-btn icon class="float-right" @click="toggleDrawer()">
      <v-icon>fas fa-times-circle</v-icon>
    </v-btn>
    <p>Add up to 10 Schools and 10 Fields of Study to compare.</p>
    <v-row style="height: 100%">
      <v-col cols="12" md="6">

        <h3 class="title">Compare Schools</h3>

        <div class="my-3">
          <v-checkbox
            @change="handleToggleCompareItem(school,schoolKey)"
            v-for="school in schools"
            :key="school.schoolId"
            :value="school.schoolId"
            hide-details
            v-model="selectedSchools"
            color="secondary"
            class="my-5 pa-0"
          >
            <template v-slot:label>
              <h4>
                {{school.schoolName}}
              </h4>
            </template>
          </v-checkbox>

        </div>

        <!-- Medium and smaller button-->
        <div class="d-md-none mt-5 text-center">
          <v-btn
            rounded
            color="secondary"
            :href="$baseUrl+'/compare'"
          >
            Compare Schools
          </v-btn>
        </div>

      </v-col>

      <v-col cols="12" md="6">
        <h3 class="title compare-drawer-fos-title">Compare Fields Of Study</h3>

        <div class="my-3 compare-drawer-fos-checkbox-container">
          <v-checkbox
            v-for="fieldOfStudy in fieldsOfStudy"
            @change="handleToggleCompareItem(fieldOfStudy, fieldOfStudyKey)"
            :key="generateFieldOfStudyString(fieldOfStudy)"
            hide-details
            v-model="selectedFieldsOfStudy"
            :value="generateFieldOfStudyString(fieldOfStudy)"
            color="secondary"
            class="my-5"
          >
            <template v-slot:label>
              <div class="">
                <h4>{{fieldOfStudy.fosTitle | formatCip2Title}}</h4>
                <h5>{{fieldOfStudy.credentialTitle}}</h5>
                <h5>{{fieldOfStudy.institutionName}}</h5>
              </div>
            </template>
          </v-checkbox>
        </div>

        <!-- Medium and smaller button-->
        <div class="d-md-none mt-5 text-center">
          <v-btn class="compare-drawer-button"
                 rounded
                 color="secondary"
                 :href="$baseUrl+'/compare/?toggle=fos'"
          >
            Compare Fields Of Study
          </v-btn>
        </div>

      </v-col>
    </v-row>

    <!-- Compare Buttons, medium or larger-->
    <v-row>
      <v-col cols="12" md="5" class="text-center d-none d-md-block" >
        <v-btn
          rounded
          color="secondary"
          :href="$baseUrl+'/compare'"
        >
          Compare Schools
        </v-btn>
      </v-col>
      <v-col cols="12" md="7" class="text-center compare-drawer-button-container d-none d-md-block">
        <v-btn class="compare-drawer-button"
               rounded
               color="secondary"
               :href="$baseUrl+'/compare/?toggle=fos'"
        >
          Compare Fields Of Study
        </v-btn>
      </v-col>
    </v-row>

  </v-card>
</template>

<style lang="scss" scoped>
  @import 'sass/_variables';
  .v-input--selection-controls.v-input .v-label {
    color: #ffffff !important;
  }

  #compare-drawer-fos-container{
    min-height: 400px;
  }

  .compare-drawer-fos-title{
    @media (min-width: 960px) {
      padding-left: 12px;
    }
  }

  .compare-drawer-button-container{

  }

  .compare-drawer-fos-checkbox-container{
    @media (min-width: 960px){
      margin-left: -12px;
      padding-left: 24px;
      border-left: 1px solid $light-gray;
      min-height: 420px;
      /*height: 100%;*/
    }
  }

  #compare-schools-content{
    @media (min-width: 960px){
      min-height: 500px;
    }

  }

  .compare-drawer-button{
    /*position: absolute;*/
    /*bottom: 24px;*/
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