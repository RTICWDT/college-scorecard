<template>
  <MedianToggle
    v-if="showMedian"
    :display-toggle="medianToggle"
    @median-tab-change="handleMedianToggle"
    group-name="School Type"
    label-prefix="Midpoint for "
  />

  <h2 class="mb-5 mt-7">Graduation Rate</h2>
  <v-checkbox
    v-model="showPellOnly"
    label="Show Pell Grant Recipients Only"
    color="secondary"
  >
    <template v-slot:label>
        Show Pell Grant Recipients Only
    </template>
  </v-checkbox>

  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #byline="{ groupName, institution }">
        <div v-if="!showPellOnly">
          <p class="text-caption text-right">
            <em>National {{ medianToggle === 'group' ? groupName : '' }} Midpoint: {{ toPercent(completionRateMidpoint(institution)) || "N/A" }}</em>
          </p>
        </div>
      </template>

      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="contextualCompletionRate(institution)"
          :value="{
            label: toPercent(contextualCompletionRate(institution)),
            value: contextualCompletionRate(institution),
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
          :median="{
            label: 'Midpoint',
            value: completionRateMidpoint(institution),
            style: { height: '60px' },
            show: !showPellOnly,
          }"
        />
      </template>
    </CompareSchoolsDataSection>
  </div>

  <h2 class="mb-5 mt-7">Students Who Return After Their First Year</h2>
  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        <ChartHorizontalBarMedian
          :shouldRender="retentionRate(institution)"
          :value="{
            label: toPercent(retentionRate(institution)),
            value: retentionRate(institution),
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

  <h2 class="mb-5 mt-7">Outcomes 8 Years After Attending</h2>
  <v-checkbox
    v-model="showPellOnly"
    label="Show Pell Grant Recipients Only"
    color="secondary"
  >
    <template v-slot:label>
        Show Pell Grant Recipients Only
    </template>
  </v-checkbox>

  <div class="px-0 px-md-5 mb-5">
    <CompareSchoolsDataSection :institutions="institutions">
      <template #data="{ institution }">
        SANKEY REPLACEMENT GOES HERE
      </template>
    </CompareSchoolsDataSection>
  </div>
</template>

<script setup>
const props = defineProps({ institutions: Object });
const { toPercent } = useNumberFormatter()
const medianToggle = ref('group')
const showMedian = computed(() => !showPellOnly.value)
const handleMedianToggle = (toggleValue) => {
  medianToggle.value = toggleValue === 0 ? "group" : "all"
}

const {
  completionRate,
  completionRatePell,
  toggleGraduationRate,
  retentionRate,
} = useComplexFieldMethods()

const showPellOnly = ref(false)

const contextualCompletionRate = computed(() => (institution) => {
  return showPellOnly.value ? completionRatePell(institution) : completionRate(institution)
})

const completionRateMidpoint = (institution) => {
  const completionRate = toggleGraduationRate(institution)
  return medianToggle.value === 'group' ? completionRate[0] : completionRate[1]
}

</script>

<style lang="scss" scoped>
</style>