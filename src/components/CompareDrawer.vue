<template>
  <v-card id="compare-schools-content" class="pa-5">
    <div>
      <span>
        Add up to 10 Schools and 10 Fields of Study to compare.
      </span>

      <div class="float-right">
        <!--<v-btn icon @click="toggleMoreInfo()">
          <v-icon v-if="showInfoText">fas fa-minus-circle</v-icon>
          <v-icon v-else>fas fa-plus-circle</v-icon>
        </v-btn> -->

        <v-btn icon @click="toggleDrawer()">
          <v-icon>fas fa-times-circle</v-icon>
        </v-btn>
      </div>
      <div style="clear: both;"></div>
    </div>

    <v-card
      v-show="showInfoText && fieldsOfStudy.length + schools.length == 1"
      id="compare-drawer-info"
      class="pa-4 my-4"
      rounded
      flat
      outlined
    >
      <p class="mb-0">
        <strong>You have just added your first item to compare.</strong> As you
        add items to compare, they will be listed here. When you are ready to
        compare, click the buttons below to go to the compare page.
      </p>
    </v-card>

    <v-card
      v-if="schools.length == 0 && fieldsOfStudy.length == 0"
      id="compare-drawer-info"
      class="pa-4 my-4"
      rounded
      flat
      outlined
    >
      <p class="mb-0">
        <strong>You have not selected anything to compare.</strong> Start by
        searching for Schools or Fields of Study to find items to compare.
      </p>
    </v-card>

    <v-card
      v-if="schools.length == 10 || fieldsOfStudy.length == 10"
      id="compare-drawer-info"
      class="pa-4 my-4"
      rounded
      flat
      outlined
    >
      <p class="mb-0">
        <strong v-if="schools.length == 10"
          >Maximum of 10 Schools reached. </strong
        >&nbsp;<strong v-if="fieldsOfStudy.length == 10"
          >Maximum of 10 Fields of Study reached.
        </strong>
      </p>
    </v-card>

    <v-row class="compare-drawer-content-container mb-md-4">
      <v-col cols="12" md="6">
        <div class="ml-n6 my-4">
          <div class="compare-drawer-section-header-wrapper ml-4">
            <div
              class="compare-icon-wrapper d-inline-block mr-2"
              style="background: #83c38c;"
            >
              <v-icon style="margin-top:7px;" color="black" size="24">
                fas fa-university
              </v-icon>
            </div>

            <div class="compare-drawer-section-header compare-button-school">
              <h3 class="title">Compare Schools</h3>
            </div>
          </div>

          <div class="my-3 pr-1 mr-1">
            <v-checkbox
              @change="handleToggleCompareSchool(school)"
              v-for="school in schools"
              :key="school.schoolId"
              :value="school.schoolId"
              hide-details
              v-model="selectedSchools"
              color="secondary"
              class="my-5 pa-0 checkbox-list"
            >
              <template v-slot:label>
                <div class="compare-drawer-fos-checkbox-label">
                  <h4>
                    {{ school.schoolName }}
                  </h4>
                </div>
              </template>
            </v-checkbox>
          </div>

          <!-- Medium and smaller button-->
          <div class="d-md-none mt-5 text-center">
            <v-btn
              color="secondary"
              @click="toggleDrawer()"
              :href="this.$url('/compare')"
              class="compare-button-school"
            >
              Compare Schools
            </v-btn>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="compare-drawer-section-wrapper my-4">
          <div class="compare-drawer-section-header-wrapper ml-4">
            <div
              class="compare-icon-wrapper d-inline-block mr-2"
              style="background: #fec005;"
            >
              <v-icon style="margin-top:7px;" color="black" size="24">
                fas fa-award
              </v-icon>
            </div>

            <div class="compare-drawer-section-header compare-button-fos">
              <h3 class="title">Compare Fields of Study</h3>
            </div>
          </div>

          <div class="my-3 compare-drawer-fos-checkbox-container pr-1">
            <v-checkbox
              v-for="fieldOfStudy in fieldsOfStudy"
              @change="handleToggleCompareFoS(fieldOfStudy)"
              :key="generateFieldOfStudyString(fieldOfStudy)"
              hide-details
              v-model="selectedFieldsOfStudy"
              :value="generateFieldOfStudyString(fieldOfStudy)"
              color="secondary"
              class="my-5 checkbox-list"
            >
              <template v-slot:label>
                <div class="compare-drawer-fos-checkbox-label">
                  <h4>{{ fieldOfStudy.fosTitle | formatCip2Title }}</h4>
                  <p class="mb-0 fos-uppercase-credential-title">
                    {{
                      fieldOfStudy.credentialTitle
                        | formatFieldOfStudyCredentialTitle
                    }}
                  </p>
                  <p class="mb-0 fos-school-name-text">
                    {{ fieldOfStudy.institutionName }}
                  </p>
                </div>
              </template>
            </v-checkbox>
          </div>

          <!-- sm and smaller button-->
          <div class="d-md-none mt-5 text-center">
            <v-btn
              class="compare-button-fos"
              color="secondary"
              @click="toggleDrawer()"
              :href="this.$url('/compare/?toggle=fos')"
            >
              Compare Fields of Study
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Compare Buttons, medium or larger-->
    <div
      id="compare-drawer-md-button-row"
      v-resize="onResize"
      v-if="schools.length > 0 || fieldsOfStudy.length > 0"
    >
      <v-row>
        <v-col cols="12" md="5" class="text-center d-none d-md-block my-2">
          <v-btn
            color="secondary"
            @click="toggleDrawer()"
            :href="this.$url('/compare')"
            class="compare-button-school"
          >
            Compare Schools
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="7"
          class="text-center compare-drawer-button-container d-none d-md-block my-2"
        >
          <v-btn
            class="compare-drawer-button compare-button-fos"
            color="secondary"
            @click="toggleDrawer()"
            :href="this.$url('/compare/?toggle=fos')"
          >
            Compare Fields of Study
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";
.v-input--selection-controls.v-input .v-label {
  color: #ffffff !important;
}

.my-3 {
  margin-left: 22px;
}

#compare-drawer-fos-container {
  min-height: 400px;
}

.compare-drawer-fos-title {
  @media (min-width: 960px) {
    padding-left: 12px;
  }
}

.compare-drawer-fos-checkbox-container {
  @media (min-width: 960px) {
    min-height: 420px;
  }
}
.compare-drawer-section-wrapper {
  border-left: 1px solid $light-gray;
  margin-left: -24px;
}

#compare-schools-content {
  overflow-y: auto;
  height: 90vh;
  border-top: 10px solid black;
  @media (min-width: 960px) {
    height: 50vh;
  }
}

.compare-drawer-content-container {
  padding-bottom: 80px;

  @media (min-width: 960px) {
    padding-bottom: 0;
  }
}

.compare-drawer-fos-checkbox-label {
  h4 {
    font-size: 13px;
    color: #000;
    margin-top: 3px;
    font-weight: 500;
  }
  p {
    font-size: 13px;
    color: #000;
    font-family: "Montserrat", "Helvetica Neue", Helvetica, arial, sans-serif !important;
    font-weight: 500;
  }

  .fos-school-name-text {
    font-family: "Public Sans", "Helvetica Neue", Helvetica, arial, sans-serif !important;
  }
  @media (min-width: 960px) {
    h4 {
      font-size: 16px;
      color: #000;
    }
    p {
      font-size: 12px;
      color: #000;
      font-family: "Montserrat", "Helvetica Neue", Helvetica, arial, sans-serif !important;
    }

    .fos-school-name-text {
      font-family: "Public Sans", "Helvetica Neue", Helvetica, arial, sans-serif !important;
    }
  }
}

#compare-drawer-md-button-row {
  position: fixed;
  bottom: 0px;
}

#compare-drawer-info {
  background: #f7f7f7;
}

.compare-icon-wrapper {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
}
.compare-drawer-section-header-wrapper {
  display: inline-table;
  h3.title {
    font-weight: bold;
  }
}

.compare-drawer-section-header {
  display: table-cell;
  vertical-align: middle;
}
</style>

<script>
// This can work on any page, it just needs data passed in and events to react when school
// is toggled.
import Share from "~/components/Share.vue"

export default {
  components: {
    share: Share,
  },
  props: {
    showInfoText: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  mounted() {
    this.$store.commit("toggleDrawer", false)
  },
  computed: {
    schools() {
      return this.$store.state.institutions
    },
    fieldsOfStudy() {
      return this.$store.state.fos
    },
    selectedSchools: {
      get() {
        return _.map(this.$store.state.institutions, "schoolId")
      },
      set(school) {
        return school
      },
    },
    selectedFieldsOfStudy: {
      get() {
        return _.map(this.$store.state.fos, (fieldOfStudy) => {
          return this.generateFieldOfStudyString(fieldOfStudy)
        })
      },
      set(fieldOfStudy) {
        return fieldOfStudy
      },
    },
  },

  methods: {
    handleToggleCompareSchool(school) {
      this.$store.commit("toggleSchool", school)
    },
    handleToggleCompareFoS(fos) {
      this.$store.commit("toggleFieldOfStudy", fos)
    },
    toggleDrawer() {
      this.$store.commit("toggleDrawer", false)
    },
    toggleMoreInfo() {
      this.$emit("toggle-more-info")
    },
    generateFieldOfStudyString(fosObject) {
      return `${fosObject.id}-${fosObject.code}-${fosObject.credentialLevel}`
    },
    onResize() {
      // setting the width for fixed position elements
      let desiredWidth = document.querySelector("#compare-header")
        ? document.querySelector("#compare-header").clientWidth
        : null

      if (desiredWidth != null) {
        document.querySelector(
          "#compare-drawer-md-button-row"
        ).style.width = `${desiredWidth}px`
      } else {
        document.querySelector(
          "#compare-drawer-md-button-row"
        ).style.width = `600px`
      }
    },
  },
  mounted() {},
}
</script>
