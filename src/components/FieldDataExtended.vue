<template>
  <div class="fos-field-data-container">
    <v-container class="pa-0">
      <v-row>
        <v-col cols="12" md="6">
          <v-card flat class="pa-5 fill-height">
            <h3>
              Median Earnings&nbsp;
              <tooltip definition="fos-median-earnings" :isBranch="isBranch" />
            </h3>
            <div>
              <div v-if="_.get(fos, fields.FOS_EARNINGS_FED_4YR)">
                <span class="display-2 navy-text font-weight-bold ">{{
                  _.get(fos, fields.FOS_EARNINGS_FED_4YR) | numeral("$0,0")
                }}</span>

                <horizontal-bar
                  v-if="_.get(fos, fields.FOS_EARNINGS_FED_4YR)"
                  :value="_.get(fos, fields.FOS_EARNINGS_FED_4YR)"
                  :min="0"
                  :max="130000"
                  color="#1470ef"
                  :height="25"
                  :labels="true"
                  type="currency"
                  class="mt-3"
                ></horizontal-bar>
              </div>

              <div v-else class="mini-data-na text-center">
                Data Not Available
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card flat class="pa-5  fill-height">
            <!--Median Total-->
            <h3>
              Median Total Debt After Graduation&nbsp;
              <tooltip
                v-if="!fosShowDebtPriorIncluded"
                definition="fos-median-debt"
                :isBranch="isBranch"
              />
              <tooltip
                v-else
                definition="fos-median-debt-all-schools"
                :isBranch="isBranch"
              />
            </h3>
            <div v-if="!fosShowDebtPriorIncluded">
              <div v-if="_.get(fos, fields.FOS_DEBT_MEDIAN)">
                <span class="display-2 navy-text font-weight-bold">{{
                  _.get(fos, fields.FOS_DEBT_MEDIAN) | numeral("$0,0")
                }}</span>

                <horizontal-bar
                  v-if="_.get(fos, fields.FOS_DEBT_MEDIAN)"
                  :value="_.get(fos, fields.FOS_DEBT_MEDIAN)"
                  :min="0"
                  :max="100000"
                  color="#1470ef"
                  :height="25"
                  :labels="true"
                  type="currency"
                  class="mt-3"
                ></horizontal-bar>
              </div>

              <div v-else class="mini-data-na text-center">
                Data Not Available
              </div>
            </div>

            <div v-else>
              <div v-if="_.get(fos, fields.FOS_DEBT_MEDIAN_PRIOR)">
                <span class="display-2 navy-text font-weight-bold">{{
                  _.get(fos, fields.FOS_DEBT_MEDIAN_PRIOR) | numeral("$0,0")
                }}</span>
                <horizontal-bar
                  v-if="_.get(fos, fields.FOS_DEBT_MEDIAN_PRIOR)"
                  :value="_.get(fos, fields.FOS_DEBT_MEDIAN_PRIOR)"
                  :min="0"
                  :max="100000"
                  color="#1470ef"
                  :height="25"
                  :labels="true"
                  type="currency"
                  class="mt-3"
                ></horizontal-bar>
              </div>

              <div v-else class="mini-data-na text-center">
                Data Not Available
              </div>
            </div>
          </v-card>
        </v-col></v-row
      >
      <v-row>
        <v-col cols="12" md="4">
          <v-card flat class="pa-5  fill-height">
            <h3>
              Monthly Earnings&nbsp;
              <tooltip definition="fos-monthly-earnings" :isBranch="isBranch" />
            </h3>
            <div>
              <div v-if="_.get(fos, fields.FOS_EARNINGS_FED_4YR)">
                <span class="display-2 navy-text font-weight-bold">{{
                  (_.get(fos, fields.FOS_EARNINGS_FED_4YR) / 12)
                    | numeral("$0,0")
                }}</span>
              </div>

              <div v-else class="mini-data-na text-center">
                Data Not Available
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card flat class="pa-5  fill-height">
            <h3>
              Monthly Loan Payment&nbsp;
              <tooltip
                v-if="!fosShowDebtPriorIncluded"
                definition="fos-monthly-debt-payment"
                :isBranch="isBranch"
                :version="
                  [5, 6, 7, 8].indexOf(fos.credential.level) < 0
                    ? 'default'
                    : 'graduate'
                "
              />
              <tooltip
                v-else
                definition="fos-monthly-debt-payment-all-schools"
                :isBranch="isBranch"
                :version="
                  [5, 6, 7, 8].indexOf(fos.credential.level) < 0
                    ? 'default'
                    : 'graduate'
                "
              />
            </h3>
            <div v-if="!fosShowDebtPriorIncluded">
              <div v-if="_.get(fos, fields.FOS_DEBT_MONTHLY)">
                <span class="display-2 navy-text font-weight-bold">{{
                  _.get(fos, fields.FOS_DEBT_MONTHLY) | numeral("$0,0")
                }}</span>
              </div>

              <div v-else class="mini-data-na text-center">
                Data Not Available
              </div>
            </div>

            <div v-else>
              <div v-if="_.get(fos, fields.FOS_DEBT_MONTHLY_PRIOR)">
                <span class="display-2 navy-text font-weight-bold">{{
                  _.get(fos, fields.FOS_DEBT_MONTHLY_PRIOR) | numeral("$0,0")
                }}</span>
              </div>

              <div v-else class="mini-data-na text-center">
                Data Not Available
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card flat class="pa-5  fill-height">
            <h3>
              Number of Graduates&nbsp;
              <tooltip definition="fos-number-of-graduates" />
            </h3>

            <div v-if="_.get(fos, fields.FOS_GRAD_COUNT) != null">
              <span class="display-2 navy-text font-weight-bold">{{
                _.get(fos, fields.FOS_GRAD_COUNT)
              }}</span>
            </div>

            <div v-else class="mini-data-na text-center">
              Data Not Available
            </div>
          </v-card>
        </v-col></v-row
      >
      <v-row
        ><v-col>
          <v-checkbox
            hide-details
            v-model="checked"
            label="Include debt borrowed at any prior institutions"
            color="secondary"
            class="mt-1 mb-4"
          >
            <template v-slot:label>
              <span class="profile-fos-include-prior-debt">
                Include debt borrowed at any prior institutions&nbsp;
                <tooltip definition="include-debt-prior-inst" />
              </span>
            </template>
          </v-checkbox> </v-col
        ><v-col class="text-right">
          <v-btn
            @click="$store.commit('toggleFieldOfStudy', fos)"
            :class="{ secondary: selectedFieldOfStudyClass() }"
          >
            Compare
            <v-icon small class="ml-1">fa fa-check-circle</v-icon>
          </v-btn>
        </v-col></v-row
      ></v-container
    >
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";
.navy-text {
  color: #1470ef;
}
</style>

<script>
import Tooltip from "~/components/Tooltip.vue"
import HorizontalBar from "~/components/HorizontalBar.vue"
export default {
  components: {
    tooltip: Tooltip,
    HorizontalBar,
  },
  props: {
    fos: {
      type: Object,
      required: true,
    },
    fosSalarySelectItems: {
      type: Array,
      required: true,
    },
    fosSalarySelect: {
      type: String,
      required: true,
    },
    fields: {
      type: Object,
      required: true,
    },
    fosShowDebtPriorIncluded: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    selectedFieldOfStudyClass() {
      if (
        _.findIndex(this.$store.state.fos, {
          code: this.fos.code,
          credentialLevel: this.fos.credential.level,
          id: this.fos.unit_id,
        }) >= 0
      ) {
        return true
      } else return false
    },
  },
  computed: {
    isBranch() {
      return this.fos.school.main_campus == 0
    },
    checked: {
      get() {
        return this.fosShowDebtPriorIncluded
      },
      set(value) {
        this.$emit("update-debt-show-prior", value)
      },
    },
  },
}
</script>
