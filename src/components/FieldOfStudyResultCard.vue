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
        <fos-school-result
          :school="this.fos['institution']"
        />

        <!-- Field of Study Info-->
        <v-col
          id="result-fos-card-credential-section"
          class="py-md-0 pl-md-6"
          cols="12"
          md="9"
        >
          <div
            class="mb-6"
            :key="`${institution.id}-${fos.title}`"
          >
            <span class="overline">{{ fos.title }}</span>

              <!-- Compare on medium and above-->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="search-fos-result-compare-button d-none d-md-block"
                    icon
                    @click="$store.commit('toggleFieldOfStudy', fos)"
                    :color="selectedFieldOfStudyClass(fos) ===
                      'result-card-selected' ? '#0075B2' : 'grey'"
                    :class="
                      selectedFieldOfStudyClass(fos) ===
                      'result-card-selected'
                        ? '' 
                        : (totalFieldOfStudyCount > 9 
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
                  <div class="hover-tip">{{compareFOSHoverCountText}}</div>
              </v-tooltip>

              <!-- Compare on small and below-->
              <div class="fos-result-compare-button-mobile">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="d-block d-sm-none mt-4 mx-auto"
                      outlined
                      @click="$store.commit('toggleFieldOfStudy', fos)"
                      :color="selectedFieldOfStudyClass(fos) ===
                        'result-card-selected' ? '#0075B2' : 'grey'"                      
                      :class="
                        selectedFieldOfStudyClass(fos) ===
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
                  <div class="hover-tip">{{compareFOSHoverCountText}}</div>
                  <!--<span>Add Field of Study to compare</span>-->
                </v-tooltip>
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
import FieldOfStudySchoolResult from "~/components/FieldOfStudySchoolResult.vue"

export default {
  mixins: [ComplexFields],
  props: {
    fos: {
      // The FoS object
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
    school() {
      console.log(this.fos['institution.school'])
      return this.fos['institution.school']
    },
    institution() {
      return this.fos['institution']
    },
    totalFieldOfStudyCount() {
      return this.$store.state.fos.length
      // return this.categorizedFieldsOfStudy.reduce((totalCount, fieldCategory) => {
      //   totalCount += fieldCategory.items.length;
      // },0);
    },
      compareFOSHoverCountText() {
        if (this.totalFieldOfStudyCount > 9){
          return "Maximum of 10 Fields of Study reached";
        }
        else{
          return "Add Field of Study to compare";
        }
      },   
  },
  components: {
    tooltip: Tooltip,
    "small-school-icons": SmallSchoolIcons,
    "fos-school-result": FieldOfStudySchoolResult
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
