<style lang="scss">
.all-fields-container {
  position: relative;
  text-align: center;

  @media (min-width: 960px) {
    text-align: right;
  }
}

.search-fos-result-credential-item-container {
  background-color: #f7f7f7;

  a {
    font-size: 16px;
    font-weight: 600;
    text-decoration: unset;
    /*text-transform: uppercase;*/
  }
}

.search-fos-result-compare-button {
  float: right;
}

.search-fos-result-title {
  padding-top: 0 !important;
  /*text-transform: uppercase;*/
  text-decoration: underline;
  line-height: 1.6rem;

  span {
    font-size: 14px;
  }

  @media (min-width: 960px) {
    padding-top: 8px !important;
    text-decoration: none;
    font-size: 16px;
    line-height: unset;

    span {
      font-size: 16px;
    }
  }

  a:hover {
    text-decoration: underline;
  }
}

.fos-result-compare-button-mobile {
  margin: auto;
}

.result-card-fos-item-truncated {
  vertical-align: middle;
}

.noCompareAllow {
  cursor: not-allowed !important;
}

</style>

<template>
  <v-card class="mx-auto pa-0 elevation-4" style="width:100%" outlined>
    <v-card-text class="pa-md-6">
      <v-row>
        <!--School Info-->
        <v-col cols="12" md="3" class="py-0">
          <p class="mt-1 mb-2" v-if="underInvestigation == 1">
            <v-card color="error" class="px-2 py-1" flat>
              <strong class="white--text">Under ED Monitoring</strong>
              <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" />
            </v-card>
          </p>

          <p class="overline mb-1">{{ city }}, {{ state }}</p>
          <h2 class="title mt-0 font-weight-bold">
            <a class="nameLink" :href="$url(schoolLink)">{{ schoolName }}</a>
          </h2>
          <p class="body-2 mt-1">{{ undergraduates | separator }} undergrads</p>
          <v-divider />
          <v-row>
            <v-col cols="12">
              <small-school-icons
                :school="school"
                :fields="fields"
                size="small"
              />
            </v-col>
          </v-row>
        </v-col>

        <!-- Field of Study Info-->
        <v-col
          id="result-fos-card-credential-section"
          class="py-md-0 pl-md-6"
          cols="12"
          md="9"
        >
          <div
            class="mb-6"
            v-for="fieldCategory in categorizedFieldsOfStudy"
            :key="`${school.id}-${fieldCategory.title}`"
          >
            <span class="overline">{{ fieldCategory.title }}</span>

            <div
              v-for="fieldOfStudy in fieldCategory.items"
              :key="
                `${school.id}-${fieldOfStudy.code}-${_.get(
                  fieldOfStudy,
                  'credential.level'
                )}`
              "
              class="search-fos-result-credential-item-container pa-3 my-3"
              :class="selectedFieldOfStudyClass(fieldOfStudy)"
            >
              <div class="d-inline-block search-fos-result-title">
                <a
                  :href="$url(
                    `${schoolLink}&fos_code=${
                      fieldOfStudy.code
                    }&fos_credential=${_.get(fieldOfStudy, 'credential.level')}`)
                  "
                >
                  <span>
                    {{
                      fieldOfStudy.title | formatFieldOfStudyTitle
                    }}&nbsp;&raquo;
                  </span>
                </a>
              </div>

              <!-- Compare on medium and above-->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="search-fos-result-compare-button d-none d-md-block"
                    icon
                    @click="$store.commit('toggleFieldOfStudy', fieldOfStudy)"
                    :color="selectedFieldOfStudyClass(fieldOfStudy) ===
                      'result-card-selected' ? '#0075B2' : 'grey'"
                    :class="
                      selectedFieldOfStudyClass(fieldOfStudy) ===
                      'result-card-selected'
                        ? '' 
                        : (compareFOSLength > 9 
                        ? 'noCompareAllow' 
                        : '')"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>fa fa-check-circle</v-icon>
                    <span class="sr-only">Compare</span>
                  </v-btn>
                </template>

                  <!--<span>Add Field of Study to compare</span>-->
                  <span>{{compareFOSHoverCountText}}</span>
              </v-tooltip>

              <!-- Compare on small and below-->
              <div class="fos-result-compare-button-mobile">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="d-block d-sm-none mt-4 mx-auto"
                      outlined
                      @click="$store.commit('toggleFieldOfStudy', fieldOfStudy)"
                      :color="selectedFieldOfStudyClass(fieldOfStudy) ===
                        'result-card-selected' ? '#0075B2' : 'grey'"                      
                      :class="
                        selectedFieldOfStudyClass(fieldOfStudy) ===
                        'result-card-selected'
                          ? '' 
                          : (totalFieldOfStudyCount > 9 
                          ? 'noCompareAllow' 
                          : '')
                      "
                      v-bind="attrs"
                      v-on="on"
                    >
                      <span class="mr-4">Compare</span
                      ><v-icon>fa fa-check-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Add Field of Study to compare</span>
                  <!--<span>Add Field of Study to compare</span>-->
                </v-tooltip>
              </div>

              <div style="clear: both;"></div>
            </div>
          </div>

          <div class="all-fields-container">
            <div v-if="showFieldOfStudyTruncated" class="mb-1">
              <p class="mb-0">
                <v-icon class="warning-orange"
                  >fas fa-exclamation-circle</v-icon
                >
                <span style="vertical-align: middle;"
                  >&nbsp;Results are limited to 5 Fields of Study per credential
                  type.</span
                >
              </p>
            </div>

            <p class="mb-0">
              <a :href="$url(fieldsLink)" target="_blank">
                View all Fields of Study at {{ schoolName }} &raquo;
              </a>
            </p>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Tooltip from "~/components/Tooltip.vue"
import SmallSchoolIcons from "~/components/SmallSchoolIcons.vue"
import ComplexFields from "~/js/mixins/ComplexFields.js"
import { fieldOfStudyCompareFormat } from "~/js/commonFormats"

export default {
  mixins: [ComplexFields],
  props: {
    school: {
      // The School object
      type: Object,
      required: true,
    },
    fosTotalDisplayCap: {
      type: Number,
      default: 10,
    },
    fosCredentialLevelDisplayCap: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      showFieldOfStudyTruncated: false,
    }
  },
  computed: {
    categorizedFieldsOfStudy() {
      // return this.categorizeFieldsOfStudy(this.school['latest.programs.cip_4_digit']);
      // console.log(this.school['latest.programs.cip_4_digit']);
      // console.log(this.categorizeFieldsOfStudy(this.school['latest.programs.cip_4_digit']));

      // Sort Item Arrays alpha ASC
      let categorizedFieldsOfStudy = this.categorizeFieldsOfStudy(
        this.school["latest.programs.cip_4_digit"]
      )

      return categorizedFieldsOfStudy.map((fieldCategory) => {
        let objectCopy = fieldCategory

        // Total cap per section
        if (objectCopy.items.length > this.fosCredentialLevelDisplayCap) {
          objectCopy.items = objectCopy.items.slice(0, 5)

          // Add visual Warning Flag.
          this.showFieldOfStudyTruncated = true
        }

        objectCopy.items = objectCopy.items.sort((a, b) => {
          if (a.title < b.title) {
            return -1
          }
          if (a.title > b.title) {
            return 1
          }
          return 0
        })

        return objectCopy
      })
    },
    totalFieldOfStudyCount() {
      return this.$store.state.fos.length
      // return this.categorizedFieldsOfStudy.reduce((totalCount, fieldCategory) => {
      //   totalCount += fieldCategory.items.length;
      // },0);
    },
      compareFOSHoverCountText() {
        if (this.totalFieldOfStudyCount.length > 9){
          return "Maximum of 10 Fields of Study reached";
        }
        else{
          return "Add Field of Study to compare";
        }
      },
      compareFOSLength() {
        if (this.selectedFieldsOfStudy)
        return this.selectedFieldsOfStudy.length;
      },    
  },
  components: {
    tooltip: Tooltip,
    "small-school-icons": SmallSchoolIcons,
  },
  methods: {
    selectedFieldOfStudyClass(
      fieldOfStudy,
      compareList = this.$store.state.fos
    ) {
      if (
        _.findIndex(
          compareList,
          this.fieldOfStudyCompareFormat(fieldOfStudy)
        ) >= 0
      ) {
        return "result-card-selected"
      }
    },
  },
}
</script>
