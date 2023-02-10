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
        <!--School Info-->
        <v-col cols="12" md="3" class="pt-0 pb-8">
          <p class="mt-1 mb-2" v-if="underInvestigation == 1">
            <v-card color="error" class="px-2 py-1" flat>
              <strong class="white--text">Under ED Monitoring</strong>
              <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" />
            </v-card>
          </p>

          <h2 class="title mt-0 font-weight-bold">
            <a class="nameLink" :href="$url(schoolLink)">{{ schoolName }}</a>
          </h2>
          <p class="mb-1 font-weight-bold">{{ city }}, {{ state }} {{ zip }}</p>
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
</template>

<script>
import Tooltip from "~/components/Tooltip.vue"
import SmallSchoolIcons from "~/components/SmallSchoolIcons.vue"
import ComplexFields from "~/js/mixins/ComplexFields.js"
import { fieldOfStudyCompareFormat } from "~/js/commonFormats"

export default {
  name: 'FieldOfStudySchoolResult',
  mixins: [ComplexFields],
  props: {
    school: {
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
    institution() {
      return this.school['institution']
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
<style lang="scss" scoped>
.nameLink {
  text-decoration: none;
  line-height: 125%;
  &:hover {
    text-decoration: underline;
  }
}
</style>