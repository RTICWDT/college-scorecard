<template>
  <div class="fos-field-data-container">
    <h2>
      Salary After Completing
    </h2>

    <!-- Salary After Completing-->
    <!--<v-row>
      <v-col cols="12" md="6">
        <h4>
          Median Earnings&nbsp;
          <tooltip definition="fos-median-earnings" />
        </h4>

        <div>
          <div v-if="_.get(fos, fields.FOS_EARNINGS_FED)">
            <span class="display-2 navy-text font-weight-bold ">{{
              _.get(fos, fields.FOS_EARNINGS_FED) | numeral("$0,0")
            }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <h4>
          Monthly Earnings&nbsp;
          <tooltip definition="fos-monthly-earnings" />
        </h4>

        <div>
          <div v-if="_.get(fos, fields.FOS_EARNINGS_FED)">
            <span class="display-2 navy-text font-weight-bold">{{
              (_.get(fos, fields.FOS_EARNINGS_FED) / 12) | numeral("$0,0")
            }}</span>
          </div>

          <div v-else class="mini-data-na text-center">
            Data Not Available
          </div>
        </div>
      </v-col>
    </v-row>-->

    <v-simple-table>
      <tbody>
        <tr>
          <!--Median Earnings-->
          <td width="50%">
            <h4>
              Median Earnings&nbsp;
              <tooltip definition="fos-median-earnings" />
            </h4>
          </td>
          <td>
            <div>
              <div v-if="_.get(fos, fields.FOS_EARNINGS_FED)">
                <span class="display-2 navy-text font-weight-bold ">{{
                  _.get(fos, fields.FOS_EARNINGS_FED) | numeral("$0,0")
                }}</span>
              </div>

              <div v-else class="mini-data-na text-center">
                Data Not Available
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <!--Monthly Earnings-->
          <td cols="12" md="6">
            <h4>
              Monthly Earnings&nbsp;
              <tooltip definition="fos-monthly-earnings" />
            </h4>
          </td>
          <td>
            <div>
              <div v-if="_.get(fos, fields.FOS_EARNINGS_FED)">
                <span class="display-2 navy-text font-weight-bold">{{
                  (_.get(fos, fields.FOS_EARNINGS_FED) / 12) | numeral("$0,0")
                }}</span>
              </div>

              <div v-else class="mini-data-na text-center">
                Data Not Available
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </v-simple-table>

    <!-- Financial Aid &amp; Debt-->

    <h2 class="mb-0">
      Financial Aid &amp; Debt
    </h2>
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
    </v-checkbox>

    <v-simple-table>
      <tbody>
        <tr>
          <!--Median Total-->
          <td width="50%">
            <h4>
              Median Total Debt After Graduation&nbsp;
              <tooltip
                v-if="!fosShowDebtPriorIncluded"
                definition="fos-median-debt"
              />
              <tooltip v-else definition="fos-median-debt-all-schools" />
            </h4>
          </td>
          <td>
            <div v-if="!fosShowDebtPriorIncluded">
              <div v-if="_.get(fos, fields.FOS_DEBT_MEDIAN)">
                <span class="display-2 navy-text font-weight-bold">{{
                  _.get(fos, fields.FOS_DEBT_MEDIAN) | numeral("$0,0")
                }}</span>
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
              </div>

              <div v-else class="mini-data-na text-center">
                Data Not Available
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <!--Monthly Loan-->
            <h4>
              Monthly Loan Payment&nbsp;
              <tooltip
                v-if="!fosShowDebtPriorIncluded"
                definition="fos-monthly-debt-payment"
              />
              <tooltip
                v-else
                definition="fos-monthly-debt-payment-all-schools"
              />
            </h4>
          </td>
          <td>
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
          </td>
        </tr>
      </tbody></v-simple-table
    >

    <h2>
      Additional Information
    </h2>

    <v-simple-table>
      <tbody>
        <tr>
          <!--Number Of Graduates-->
          <td width="50%">
            <h4>
              Number Of Graduates&nbsp;
              <tooltip definition="fos-number-of-graduates" />
            </h4>
          </td>
          <td>
            <div v-if="_.get(fos, fields.FOS_GRAD_COUNT)">
              <span class="display-2 navy-text font-weight-bold">{{
                _.get(fos, fields.FOS_GRAD_COUNT)
              }}</span>
            </div>

            <div v-else class="mini-data-na text-center">
              Data Not Available
            </div>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";

h2 {
  margin: 2rem 0 0.5rem;
}
.display-2 {
  font-size: 22px !important;
}
.fos-field-data-title {
  font-weight: 500;
}
#showGradOnly {
  .v-messages {
    display: none;
  }
}
</style>

<script>
import Tooltip from "~/components/Tooltip.vue"

export default {
  components: {
    tooltip: Tooltip,
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
