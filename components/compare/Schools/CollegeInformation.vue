<template>
  <h2 class="mb-5 mt-7">Full Time Enrollment</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="fullTimeEnrollment(institution)"
          :value="{
            label: toPercent(fullTimeEnrollment(institution)),
            value: fullTimeEnrollment(institution),
          }"
          :min="{
            label: '0%',
            value: 0,
            style: { height: '60px' },
          }"
          :max="{
            label: '100%',
            value: 1,
            style: { height: '60px' },
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>

  <h2 class="mb-5">School Information</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <v-container class="pa-0 pt-3">
          <v-row class="pa-0">
            <v-col cols="12" sm="12" md="6">
              <SmallSchoolIcons :school="institution" :fields="fields" />
            </v-col>
            <v-col cols="12" sm="12" md="3" class="pa-0 pl-5 pl-md-0">
              <div class="my-2 flex-grow-1 text-left text-md-center">
                <h2 class="d-inline-block d-md-block">{{ toNumber(undergraduates(institution)) }}</h2>
                <p class="d-inline-block d-md-block ml-2 ml-md-0">undergraduates</p>
              </div>
            </v-col>
            <v-col cols="12" sm="12" md="3"  class="pa-0 pl-5 pl-md-0 pb-7 text-left text-md-center">
              <a :href="schoolUrl(institution)" target="_blank">
                {{ formatUrlText(schoolUrl(institution)) }}
                <v-icon size="x-small">mdi-open-in-new</v-icon>
              </a>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </CompareSchoolsDataSection>
  </div>

  <h2 class="mb-5">Socio-Economic Diversity</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="socioEconomicDiversity(institution)"
          :value="{
            label: toPercent(socioEconomicDiversity(institution)),
            value: socioEconomicDiversity(institution),
          }"
          :min="{
            label: '0%',
            value: 0,
            style: { height: '60px' },
          }"
          :max="{
            label: '100%',
            value: 1,
            style: { height: '60px' },
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>

  <h2 class="mb-5">Race/Ethnicity</h2>
  <div class="px-0 px-md-5 mb-5">
    <v-select
      :items="raceEthnicitySelection"
      v-model="currentRaceEthnicity"
      color="secondary"
      variant="outlined"
    />

    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="currentRaceEthnicityPercentage(institution)"
          :value="{
            label: toPercent(currentRaceEthnicityPercentage(institution)),
            value: currentRaceEthnicityPercentage(institution),
          }"
          :min="{
            label: '0%',
            value: 0,
            style: { height: '60px' },
          }"
          :max="{
            label: '100%',
            value: 1,
            style: { height: '60px' },
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>
</template>

<script setup>
const props = defineProps({ institutions: Object });
const { toNumber, toPercent } = useNumberFormatter()
const { fields } = useConstants()
import { formatUrlText } from '~/utils/filters'

const {
  fullTimeEnrollment,
  undergraduates,
  schoolUrl,
  socioEconomicDiversity,
  raceEthnicity,
} = useComplexFieldMethods()

const raceEthnicitySelection = [
  { title: 'American Indian/Alaska Native', value: 'American Indian/Alaska Native' },
  { title: 'Asian', value: 'Asian' },
  { title: 'Black', value: 'Black' },
  { title: 'Hispanic', value: 'Hispanic' },
  { title: 'Native Hawaiian/Pacific Islander', value: 'Native Hawaiian/Pacific Islander' },
  { title: 'Non-resident alien',value: 'Non-resident alien'},
  { title: 'Two or more races', value: 'Two or more races' },
  { title: 'Unknown', value: 'Unknown' },
  { title: 'White', value: 'White' },
]

const currentRaceEthnicity = ref(raceEthnicitySelection[0].title)

const currentRaceEthnicityPercentage = computed(() => (institution) => {
  const data = raceEthnicity(institution)
  const current = currentRaceEthnicity.value

  const metric = data.find((item) => item.label === current)
  return metric ? metric.value : null
})

</script>

<style lang="scss" scoped>
</style>