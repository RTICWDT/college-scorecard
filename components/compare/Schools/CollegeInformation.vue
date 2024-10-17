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
        <div class="d-flex flex-column flex-md-row py-5">
          <div class="flex-grow-1">
            <SmallSchoolIcons :school="institution" :fields="fields" />
          </div>
          <div class="d-block d-md-flex flex-grow-1">
            <div class="my-5 my-md-0 text-center flex-grow-1">
              <h2 class="">{{ toNumber(undergraduates(institution)) }}</h2>
              <p>undergraduates</p>
            </div>
            <div class="text-center flex-grow-1">
              <a :href="schoolUrl(institution)" target="_blank">
                {{ formatUrlText(schoolUrl(institution)) }}
                <v-icon size="x-small">mdi-open-in-new</v-icon>
              </a>
            </div>
          </div>
        </div>
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