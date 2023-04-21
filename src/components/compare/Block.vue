<template>
  <div>
    <h4 class="overline mb-3 mt-3 ml-4">{{ block_title }}</h4>
    <div
      class="mx-sm-6 mx-2 compareBlockHeader"
      v-if="
        !isFieldOfStudy &&
          config &&
          config.medianToggle &&
          config.type == 'average-annual-cost'
      "
    >
      <p class="median-value-text">
        National
        {{
          config.medianToggle === "group"
            ? block_title.replace("schools", "Midpoint")
            : "Midpoint"
        }}:
        {{
          $options.filters.numeral(
            config.medianToggle === "group"
              ? fakeAverageAnnualCosts[
                  _.get(schools[0], fields["PREDOMINANT_DEGREE"])
                ][0]
              : fakeAverageAnnualCosts[
                  _.get(schools[0], fields["PREDOMINANT_DEGREE"])
                ][1],
            "$0,0"
          )
        }}
      </p>
    </div>
    <div
      class="mx-sm-6 mx-2 compareBlockHeader"
      v-if="
        !isFieldOfStudy &&
          config &&
          config.medianToggle &&
          config.type == 'median-earnings'
      "
    >
      <p class="median-value-text">
        National
        {{
          config.medianToggle === "group"
            ? block_title.replace("schools", "Midpoint")
            : "Midpoint"
        }}:
        {{
          $options.filters.numeral(
            config.medianToggle === "group"
              ? fakeMedianEarnings[
                  _.get(schools[0], fields["PREDOMINANT_DEGREE"])
                ][0]
              : fakeMedianEarnings[
                  _.get(schools[0], fields["PREDOMINANT_DEGREE"])
                ][1],
            "$0,0"
          )
        }}
      </p>
    </div>
    <div
      class="mx-sm-6 mx-2 compareBlockHeader"
      v-if="
        !isFieldOfStudy &&
          config &&
          config.medianToggle &&
          config.type == 'graduation-rate' &&
          !config.showPellOnly
      "
    >
      <p class="median-value-text">
        National
        {{
          config.medianToggle === "group"
            ? block_title.replace("schools", "Midpoint")
            : "Midpoint"
        }}:
        {{
          $options.filters.numeral(
            config.medianToggle === "group"
              ? fakeGraduationRate[
                  _.get(schools[0], fields["PREDOMINANT_DEGREE"])
                ][0]
              : fakeGraduationRate[
                  _.get(schools[0], fields["PREDOMINANT_DEGREE"])
                ][1],
            "0%"
          )
        }}
      </p>
    </div>

    <div v-if="config && config.chart == 'RepaymentRate'">
      <v-simple-table class="repayment-table">
        <caption class="sr-only">
          Repayment Rates
        </caption>
        <thead>
          <tr>
            <th>School</th>
            <th>Percent {{ repaymentCategory }}</th>
          </tr>
        </thead>
        <tbody>
          <compare-table-row
            v-for="school in schools"
            :key="school.id"
            :school="school"
            :config="config"
            :currentHighlight="currentHighlight"
            @update-highlight="$emit('update-highlight', $event)"
          />
        </tbody>
      </v-simple-table>
    </div>

    <div
      v-else
      v-for="school in schools"
      :key="school.id"
      class="ml-sm-6 ml-2 compareBlocks"
    >
      <div
        v-if="isFieldOfStudy"
        :class="{
          active:
            currentHighlight ===
            `fos-${school.unit_id}-${school.code}-${
              school['credential.level']
            }`,
        }"
        @click="
          currentHighlight !=
          `fos-${school.unit_id}-${school.code}-${school['credential.level']}`
            ? $emit(
                'update-highlight',
                `fos-${school.unit_id}-${school.code}-${
                  school['credential.level']
                }`
              )
            : $emit('update-highlight', '')
        "
      >
        <div class="pb-5 pb-md-1 px-md-5 px-1">
          <p class="subtitle-2 pb-0 mb-0">
            <a
              :href="
                `/school?${school.unit_id}&fos_code=${
                  school.code
                }&fos_credential=${school['credential.level']}`
              "
            >
              <strong>{{ school.title | formatFieldOfStudyTitle }}</strong> -
              {{ school["school.name"] }}
            </a>
          </p>

          <div class="compare-fos-metric-container">
            <slot
              name="fos-row"
              v-bind:school="school"
              :config="config"
              :currentHighlight="currentHighlight"
            >
            </slot>
          </div>
        </div>
      </div>

      <div v-else>
        <slot
          name="institution-row"
          v-bind:school="school"
          :config="config"
          :currentHighlight="currentHighlight"
        >
          <compare-row
            :school="school"
            :config="config"
            :currentHighlight="currentHighlight"
            @update-highlight="$emit('update-highlight', $event)"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~/sass/_variables";
.compareBlocks {
  border-left: 1px solid $dark-gray;
}

.active {
  background-color: #faefd2 !important;
}

.median-value-text {
  font-size: 12px;
  text-align: right;
  font-style: italic;
  padding-bottom: 16px;
  margin-bottom: 0;
}

.repayment-table td {
  width: 25%;
}

.compareBlockHeader {
  border-left: 1px solid #666;
}
</style>

<script>
import CompareRow from "~/components/compare/Row.vue"
import CompareTableRow from "~/components/compare/TableRow.vue"
import { fields } from "~/js/constants"
import ComplexFields from "~/js/mixins/ComplexFields.js"

export default {
  mixins: [ComplexFields],
  components: {
    "compare-row": CompareRow,
    "compare-table-row": CompareTableRow,
  },
  props: {
    block_title: {
      type: String,
    },
    schools: {
      type: Array,
    },
    currentHighlight: {
      type: String,
    },
    config: {
      type: Object,
    },
    isFieldOfStudy: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    groupName() {
      switch (this.block_title) {
        case "Certificate schools":
          return 1
          break
        case "2-year schools":
          return 2
          break
        case "4-year schools":
          return 3
          break
      }
    },
    schOne() {
      return this.schools[0]
    },
    repaymentCategory() {
      switch (this.config.repaymentStatus) {
        case "fullypaid":
          return "Paid In Full"
          break
        case "makingprogress":
          return "Making Progress"
          break
        case "noprogress":
          return "Not Making Progress"
          break
        case "deferment":
          return "Deferment"
          break
        case "delinquent":
          return "Delinquent"
          break
        case "default":
          return "Defaulted"
          break
        case "discharge":
          return "Discharged"
          break
        case "forbearance":
          return "Forbearance"
          break
      }
    },
  },
}
</script>
