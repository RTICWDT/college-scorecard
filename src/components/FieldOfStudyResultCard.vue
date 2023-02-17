<style lang="scss" scoped>
.text-uppercase {
  font-size: 11px;
}
.display-2 {
  display: block;
  margin-bottom: 5px;
}
.cell {
  min-height: 100px;
  margin-bottom: 10px;
}
</style>
<template>
  <v-row class="py-2">
    <!--School Info-->
    <v-col cols="12" md="3">
      <h2 class="">
        <a class="nameLink mb-2" :href="$url(dynamicLink)">{{ schoolName }}</a>
      </h2>
      <p class="font-weight-bold">{{ city }}, {{ state }} {{ zip }}</p>
      <small-school-icons :school="school" :fields="fields" size="small" />
      <p v-if="underInvestigation == 1">
        <v-card color="error" class="px-2 py-1" flat>
          <strong class="white--text">Under ED Monitoring</strong>
          <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" />
        </v-card>
      </p>
    </v-col>
    <v-col cols="4" md="3">
      <div class="cell">
        <div class="text-uppercase font-weight-bold">
          Median Earnings
          <tooltip definition="fos-median-earnings" :isBranch="isBranch" />
        </div>

        <div v-if="_.get(fos, fields.FOS_EARNINGS_FED_4YR)">
          <span class="display-2 navy-text font-weight-bold ">{{
            _.get(fos, fields.FOS_EARNINGS_FED_4YR) | numeral("$0,0")
          }}</span>
          <div style="max-width:160px;height:30px;">
            <horizontal-bar
              :value="_.get(fos, fields.FOS_EARNINGS_FED_4YR)"
              :min="0"
              :max="100000"
              :color="'#1874DC'"
              :bgcolor="'#DFE6F0'"
              :height="25"
              :type="'currency'"
              :labels="false"
              :yBarThickness="10"
            ></horizontal-bar>
            <span>0k</span><span class="float-right">100k</span>
          </div>
        </div>
        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>
      </div>
      <div class="cell">
        <div class="text-uppercase font-weight-bold">
          Monthly Earnings
          <tooltip definition="fos-monthly-earnings" :isBranch="isBranch" />
        </div>
        <div v-if="_.get(fos, fields.FOS_EARNINGS_FED_4YR)">
          <span class="display-2 navy-text font-weight-bold ">{{
            _.get(fos, fields.FOS_EARNINGS_FED_4YR / 12) | numeral("$0,0")
          }}</span>
        </div>
        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>
      </div>
    </v-col>
    <v-col cols="4" md="3">
      <div class="cell">
        <div class="text-uppercase font-weight-bold">
          Median Debt
          <tooltip
            definition="fos-median-debt"
            :isBranch="isBranch"
            class="ml-1"
          />
        </div>
        <div v-if="_.get(fos, fields.FOS_DEBT_MEDIAN)">
          <span class="display-2 navy-text font-weight-bold ">{{
            _.get(fos, fields.FOS_DEBT_MEDIAN) | numeral("$0,0")
          }}</span>
          <div style="max-width:160px;height:30px;">
            <horizontal-bar
              :value="_.get(fos, fields.FOS_DEBT_MEDIAN)"
              :min="0"
              :max="100000"
              :color="'#1874DC'"
              :bgcolor="'#DFE6F0'"
              :height="25"
              :type="'currency'"
              :labels="false"
              :yBarThickness="10"
            ></horizontal-bar>
            <span>0k</span><span class="float-right">100k</span>
          </div>
        </div>
        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>
      </div>
      <div class="cell">
        <div class="text-uppercase font-weight-bold">
          Monthly Loan Payment
          <tooltip
            definition="fos-monthly-debt-payment"
            :isBranch="isBranch"
            class="ml-1"
          />
        </div>
        <div v-if="_.get(fos, fields.FOS_DEBT_MONTHLY)">
          <span class="display-2 navy-text font-weight-bold ">{{
            _.get(fos, fields.FOS_DEBT_MONTHLY) | numeral("$0,0")
          }}</span>
        </div>
        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>
      </div>
    </v-col>
    <v-col cols="3" md="2">
      <div class="cell">
        <div class="text-uppercase  font-weight-bold">Graduates</div>

        <div v-if="_.get(fos, fields.FOS_GRAD_COUNT)">
          <span class="display-2 navy-text font-weight-bold">{{
            _.get(fos, fields.FOS_GRAD_COUNT) | numeral("0,0")
          }}</span>
        </div>
        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>
      </div>
    </v-col>
    <v-col cols="1" md="1">
      <div class="text-right" :key="`${institution.id}-${fos.title}`">
        <!-- Compare on medium and above-->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="search-fos-result-compare-button"
              icon
              @click="$store.commit('toggleFieldOfStudy', fos)"
              :color="
                selectedFieldOfStudyClass(fos) === 'result-card-selected'
                  ? '#0075B2'
                  : 'grey'
              "
              :class="
                selectedFieldOfStudyClass(fos) === 'result-card-selected'
                  ? ''
                  : totalFieldOfStudyCount > 9
                  ? 'noCompareAllow'
                  : ''
              "
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>fa fa-check-circle</v-icon>
              <span class="sr-only">Compare</span>
            </v-btn>
          </template>

          <!--<span>Add Field of Study to compare</span>-->
          <div class="hover-tip">{{ compareFOSHoverCountText }}</div>
        </v-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Tooltip from "~/components/Tooltip.vue"
import SmallSchoolIcons from "~/components/SmallSchoolIcons.vue"
import ComplexFields from "~/js/mixins/ComplexFields.js"
import FieldOfStudySchoolResult from "~/components/FieldOfStudySchoolResult.vue"
import HorizontalBar from "~/components/HorizontalBar.vue"
import _ from "lodash"

export default {
  mixins: [ComplexFields],
  props: {
    fos: {
      // The FoS object
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      school: null,
    }
  },
  computed: {
    institution() {
      return this.fos["institution"]
    },
    totalFieldOfStudyCount() {
      return this.$store.state.fos.length
    },
    compareFOSHoverCountText() {
      if (this.totalFieldOfStudyCount > 9) {
        return "Maximum of 10 Fields of Study Reached"
      } else {
        return "Add Field of Study to Compare"
      }
    },
    dynamicLink() {
      if (this.fos.credential.level <= 3) {
        return this.schoolLink
      } else {
        return this.fieldsLink
      }
    },
  },
  components: {
    tooltip: Tooltip,
    "small-school-icons": SmallSchoolIcons,
    "fos-school-result": FieldOfStudySchoolResult,
    "horizontal-bar": HorizontalBar,
  },
  mounted() {
    // flatten the school to work with the computed fields.
    this.school = _.merge(this.fos.institution, this.fos.institution.school)
  },
}
</script>
