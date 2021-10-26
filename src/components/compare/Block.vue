<template>
  <div>
    <h4 class="overline my-3 pt-15">{{ block_title }}</h4>
     <p class="median-value-text" v-if="config && config.medianToggle && config.type == 'average-annual-cost'" >Median for {{config.medianToggle === 'group' ? block_title.replace('schools', 'Schools') : "All Schools"}}: {{this.$options.filters.numeral(config.medianToggle === 'group' ? fakeAverageAnnualCost[parseInt(groupName)] : fakeAverageAnnualCost[4] ,'$0,0')}}</p>
     <p class="median-value-text" v-if="config && config.medianToggle && config.type == 'median-earnings'" >Median for {{config.medianToggle === 'group' ? block_title.replace('schools', 'Schools') : "All Schools"}}: {{this.$options.filters.numeral(config.medianToggle === 'group' ? fakeMedianEarnings[parseInt(groupName)] : fakeMedianEarnings[4] ,'$0,0')}}</p>
     <p class="median-value-text" v-if="config && config.medianToggle && config.type == 'graduation-rate'" >Median for {{config.medianToggle === 'group' ? block_title.replace('schools', 'Schools') : "All Schools"}}: {{this.$options.filters.numeral(config.medianToggle === 'group' ? fakeGraduationRate[parseInt(groupName)] : fakeGraduationRate[4] ,'0%')}}</p>     

      <div v-if="config && config.chart == 'RepaymentRate'">
      <v-simple-table class="repayment-table">
        <caption class="sr-only">
          Average cost by family income
        </caption>
        <thead>
          <tr>
            <th>School</th>
            <th>Percent {{repaymentCategory}}</th>
          </tr>
        </thead>
        <tbody>
              <compare-table-row v-for="school in schools"
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
      class="ml-sm-5 ml-1 compareBlocks"
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
          $emit(
            'update-highlight',
            `fos-${school.unit_id}-${school.code}-${school['credential.level']}`
          )
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

.compare-fos-metric-container {
  margin: 0.8rem 0;
}

.median-value-text {
  font-size:12px;
  text-align:right;
  font-style:italic;
}

.repayment-table td {
  width:25%;
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
    repaymentCategory() {
        switch (this.config.repaymentStatus) {
          case "fullypaid": 
            return "Paid In Full"
            break
          case "makingprogress": 
            return"Making Progress"
            break
          case "noprogress": 
            return"Not Making Progress"
            break
          case "deferment": 
            return"Deferment"
            break
          case "delinquent": 
            return"Delinquent"
            break
          case "default": 
            return"Defaulted"
            break
          case "discharge": 
            return"Discharged"
            break
          case "forbearance": 
            return"Forbearance"
            break
      }
    }
  },
}
</script>
