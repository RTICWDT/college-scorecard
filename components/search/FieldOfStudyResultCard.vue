<template>
  <v-row class="py-2">
    <!-- School Info -->
    <v-col cols="12" md="3">
      <div
        class="d-block d-md-none text-right"
        :key="`${institution.id}-${fos.title}`"
      >
        <!-- Compare on medium and above -->
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              class="search-fos-result-compare-button"
              icon
              @click="toggleFieldOfStudy(fos)"
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
              v-bind="props"
            >
              <v-icon>mdi-check-circle</v-icon>
              <span class="sr-only">Compare</span>
            </v-btn>
          </template>
          <div class="hover-tip">{{ compareFOSHoverCountText }}</div>
        </v-tooltip>
      </div>
      <h2>
        <NuxtLink class="nameLink mb-2" :to="dynamicLink">{{ schoolName }}</NuxtLink>
      </h2>
      <p>{{ city }}, {{ state }} {{ zip }}</p>
      <SmallSchoolIcons :school="school" :fields="fields" size="small" fos />
      <p v-if="underInvestigation === 1">
        <v-card color="error" class="px-2 py-1" variant="flat">
          <strong class="text-white">Under ED Monitoring</strong>
          <tooltip definition="hcm2" color="#FFFFFF" class="ml-2" />
        </v-card>
      </p>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <div class="cell">
        <div class="text-uppercase">
          Median Earnings
          <tooltip :definition="'fos-median-earnings'" :is-branch="isBranch" />
        </div>
        <div v-if="fos[fields.FOS_EARNINGS_FED_5YR]">
          <span class="display-2 text-navy font-weight-bold">
            {{ numeral(fos[fields.FOS_EARNINGS_FED_5YR], '$0,0') }}
          </span>
          <div style="max-width:160px;height:30px;">
            <!-- <horizontal-bar
              :value="fos[fields.FOS_EARNINGS_FED_5YR]"
              :min="0"
              :max="100000"
              color="#1874DC"
              bgcolor="#DFE6F0"
              :height="25"
              type="currency"
              :labels="false"
              :y-bar-thickness="10"
            /> -->
            <span>0k</span><span class="float-right">100k</span>
          </div>
        </div>
        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>
      </div>
      <div class="cell">
        <div class="text-uppercase">
          Monthly Earnings
          <tooltip :definition="'fos-monthly-earnings'" :is-branch="isBranch" />
        </div>
        <div v-if="fos[fields.FOS_EARNINGS_FED_5YR]">
          <span class="display-2 text-navy font-weight-bold">
            {{ numeral(fos[fields.FOS_EARNINGS_FED_5YR] / 12, '$0,0') }}
          </span>
        </div>
        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>
      </div>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <div class="cell">
        <div class="text-uppercase">
          Median Debt
          <tooltip
            :definition="'fos-median-debt'"
            :is-branch="isBranch"
            class="ml-1"
          />
        </div>
        <div v-if="fos[fields.FOS_DEBT_MEDIAN]">
          <span class="display-2 text-navy font-weight-bold">
            {{ numeral(fos[fields.FOS_DEBT_MEDIAN], '$0,0') }}
          </span>
          <div style="max-width:160px;height:30px;">
            <!-- <horizontal-bar
              :value="fos[fields.FOS_DEBT_MEDIAN]"
              :min="0"
              :max="100000"
              color="#1874DC"
              bgcolor="#DFE6F0"
              :height="25"
              type="currency"
              :labels="false"
              :y-bar-thickness="10"
            /> -->
            <span>0k</span><span class="float-right">100k</span>
          </div>
        </div>
        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>
      </div>
      <div class="cell">
        <div class="text-uppercase">
          Monthly Loan Payment
          <tooltip
            :definition="'fos-monthly-debt-payment'"
            :is-branch="isBranch"
            class="ml-1"
          />
        </div>
        <div v-if="fos[fields.FOS_DEBT_MONTHLY]">
          <span class="display-2 text-navy font-weight-bold">
            {{ numeral(fos[fields.FOS_DEBT_MONTHLY], '$0,0') }}
          </span>
        </div>
        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>
      </div>
    </v-col>
    <v-col cols="12" sm="6" md="2">
      <div class="cell">
        <div class="text-uppercase font-weight-bold">Graduates</div>
        <div v-if="fos[fields.FOS_GRAD_COUNT]">
          <span class="display-2 text-navy font-weight-bold">
            {{ numeral(fos[fields.FOS_GRAD_COUNT], '0,0') }}
          </span>
        </div>
        <div v-else class="mini-data-na text-center">
          Data Not Available
        </div>
      </div>
    </v-col>
    <v-col cols="12" sm="6" md="1">
      <div
        class="d-none d-md-block text-right"
        :key="`${institution.id}-${fos.title}`"
      >
        <!-- Compare on medium and above -->
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              class="search-fos-result-compare-button"
              icon
              @click="toggleFieldOfStudy(fos)"
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
              v-bind="props"
            >
              <v-icon>mdi-check-circle</v-icon>
              <span class="sr-only">Compare</span>
            </v-btn>
          </template>
          <div class="hover-tip">{{ compareFOSHoverCountText }}</div>
        </v-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import numeral from 'numeral'
const { fields } = useConstants()
const store = useCompareStore()

const props = defineProps({
  fos: {
    type: Object,
    required: true,
  },
})

const school = ref(useMerge(props.fos.institution, props.fos.institution.school))

const {
  zip,
  city,
  state,
  schoolName,
  schoolLink,
  fieldsLink,
  isBranch,
  underInvestigation,
} = useComplexFields(school)

const institution = computed(() => props.fos.institution)
const totalFieldOfStudyCount = computed(() => store.fos.length)

const compareFOSHoverCountText = computed(() => {
  return totalFieldOfStudyCount.value > 9
    ? "Maximum of 10 Fields of Study Reached"
    : "Add Field of Study to Compare"
})

const dynamicLink = computed(() => {
  const baseLink = props.fos.credential.level <= 3 ? schoolLink.value : fieldsLink.value
  return `${baseLink}&fos_code=${props.fos.code}&fos_credential=${props.fos.credential.level}`
})

const selectedFieldOfStudyClass = (fieldOfStudy, compareList = store.fos) => {
  if (useFindIndex(compareList, fieldOfStudyCompareFormat(fieldOfStudy)) >= 0) {
    return "result-card-selected"
  }
}

const toggleFieldOfStudy = (fos) => {
  store.commit('toggleFieldOfStudy', fos)
}
</script>

<style scoped>
.text-uppercase {
  font-size: 12px;
}
.display-2 {
  display: block;
  margin-bottom: 5px;
}
.cell {
  min-height: 100px;
  margin-bottom: 10px;
}
@media screen and (max-width: 576px) {
  .cell {
    min-height: auto;
    margin-bottom: 0;
  }
}
</style>